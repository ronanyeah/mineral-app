/* eslint-disable fp/no-loops, fp/no-mutation, fp/no-mutating-methods, fp/no-let, no-constant-condition */

import { keccak_256 } from "@noble/hashes/sha3";
import { mine, epochReset } from "./codegen/mineral/mine/functions";
import { register } from "./codegen/mineral/miner/functions";
import { SUI_CLOCK_OBJECT_ID } from "@mysten/sui.js/utils";
import { bcs } from "@mysten/sui.js/bcs";
import * as constants from "./constants";
import {
  ExecutionStatus,
  SuiClient,
  SuiTransactionBlockResponse,
  SuiTransactionBlockResponseOptions,
} from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { Ed25519Keypair } from "@mysten/sui.js/dist/cjs/keypairs/ed25519";
import { Bus } from "./codegen/mineral/mine/structs";
import { Miner } from "./codegen/mineral/miner/structs";
import numbro from "numbro";
import { SignatureWithBytes } from "@mysten/sui.js/dist/cjs/cryptography";

export const CONFIG =
  "0x0fc44c38dd791dffb696ca7448cb8b1774c17178d3dd3b0fed3480f2ac82bd5b";
export const BUSES = [
  "0x2bbc816d1139263190f738783789e23b69eb84f1293d0417432ed8c00556ed7c",
  "0x4ac2335213b48837a6036c37078af04921bac8844c982728cbcfcdc9304dce2a",
  "0x5ff0cae9a422a59fc3a9685c9d0e9e3cc58a9bc0c3eec212cd879f92e814aa4b",
  "0x6cf20bbe1f40431fcbe26dc18952f9bf025fbbeb38c9ce00ae4cc807bfa0bbd2",
  "0x72828b43f588eeb7721b50e9d8bc47a8ab2d1a9e93698109ef9afc93f364f8b6",
  "0x77092b2f9370e6a60e2e24817ad7b3dfdff7e18ee959e1d01ed5ecd8687c5e34",
  "0xacb27d661ae5eb463933c373ecdafe84023141d95e335353b02b4a3de2251a52",
  "0xb826932f675bb1215c5285b2ad3e137a6b2f91122003b6f68b6fe52cc8cd8b3b",
];

export type MineEvent =
  | "resetting"
  | "retrying"
  | "simulating"
  | "submitting"
  | "waiting";

// Use typescript-eslint or varsIgnorePattern
/* eslint-disable no-unused-vars */
enum BusStatus {
  MineOk,
  RewardsExhausted,
  ResetNeeded,
}
/* eslint-enable no-unused-vars */

export const getClient = () => {
  return new SuiClient({
    url: new URL(process.env.RPC!).toString(),
  });
};

export function fetchBus(client: SuiClient) {
  return Bus.fetch(client, BUSES[0]);
}

export function getBus() {
  return BUSES[Math.floor(Math.random() * BUSES.length)];
}

export async function findBus(
  client: SuiClient
): Promise<{ bus: Bus; status: BusStatus }> {
  const objs = await client.multiGetObjects({
    ids: BUSES,
    options: { showContent: true },
  });
  const buses = objs.map((obj) => {
    const bus = Bus.fromFieldsWithTypes(obj.data!.content! as any);
    return bus;
  });
  const busWithRewards = buses.find(
    (bus) => bus.rewards.value >= bus.rewardRate
  );
  if (busWithRewards) {
    return {
      bus: busWithRewards,
      status: canBeReset(busWithRewards.lastReset)
        ? BusStatus.ResetNeeded
        : BusStatus.MineOk,
    };
  } else {
    const bus = buses[0];
    return {
      bus,
      status: canBeReset(bus.lastReset)
        ? BusStatus.ResetNeeded
        : BusStatus.RewardsExhausted,
    };
  }
}

export async function findRewards(client: SuiClient): Promise<Bus> {
  const objs = await client.multiGetObjects({
    ids: BUSES,
    options: { showContent: true },
  });
  const buses = objs.map((obj) => {
    const bus = Bus.fromFieldsWithTypes(obj.data!.content! as any);
    return bus;
  });
  const res = buses.find((bus) => bus.rewards.value >= bus.rewardRate);
  return res ? res : buses[0];
}

export async function ship(
  preSign: SignatureWithBytes,
  client: SuiClient,
  opts?: SuiTransactionBlockResponseOptions
): Promise<SuiTransactionBlockResponse> {
  const dryRun = await client.dryRunTransactionBlock({
    transactionBlock: preSign.bytes,
  });

  if (dryRun.effects.status.status === "failure") {
    const contractErr = extractError(dryRun.effects.status);
    throw Error(contractErr || "Unknown failure");
  }

  const res = await client.executeTransactionBlock({
    transactionBlock: preSign.bytes,
    signature: preSign.signature,
    options: opts,
  });

  const _exec = await client.waitForTransactionBlock({
    digest: res.digest,
  });

  return res;
}

export function buildTx(
  txb: TransactionBlock,
  client: SuiClient,
  wallet: Ed25519Keypair
): Promise<SignatureWithBytes> {
  txb.setSender(wallet.toSuiAddress());
  txb.setGasBudget(5000000);
  return txb.sign({
    client,
    signer: wallet,
  });
}

export async function launch(
  txb: TransactionBlock,
  client: SuiClient,
  wallet: Ed25519Keypair
): Promise<SuiTransactionBlockResponse> {
  const preSign = await buildTx(txb, client, wallet);
  return ship(preSign, client);
}

export async function buildMineTx(
  nonce: bigint,
  minerId: string,
  client: SuiClient,
  bus: Bus,
  payer: string
): Promise<TransactionBlock> {
  const txb = new TransactionBlock();
  const shared = await getSharedVersion(bus.id, client);
  const [createdObj] = mine(txb, {
    nonce,
    bus: txb.sharedObjectRef({
      objectId: bus.id,
      mutable: true,
      initialSharedVersion: shared,
    }),
    clock: SUI_CLOCK_OBJECT_ID,
    miner: minerId,
  });
  txb.transferObjects([createdObj], payer);
  return txb;
}

export function fakeProof(nonce: bigint): Uint8Array {
  const dataToHash = new Uint8Array(32 + 32 + 8);
  dataToHash.set(int64to8(nonce), 64);
  const bts = keccak_256(dataToHash);
  return new Uint8Array(bts);
}

export function createHash(
  currentHash: Uint8Array,
  signerAddressBytes: Uint8Array,
  nonce: bigint
): Uint8Array {
  const dataToHash = new Uint8Array(32 + 32 + 8);
  dataToHash.set(currentHash, 0);
  dataToHash.set(signerAddressBytes, 32);
  dataToHash.set(int64to8(nonce), 64);
  const bts = keccak_256(dataToHash);
  return new Uint8Array(bts);
}

export function validateHash(hash: Uint8Array, difficulty: number) {
  return hash.slice(0, difficulty).reduce((a, b) => a + b, 0) === 0;
}

export function int64to8(n: bigint) {
  const arr = BigUint64Array.of(n);
  return new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength);
}

export async function getProof(
  client: SuiClient,
  address: string
): Promise<string | null> {
  const res = await client.getOwnedObjects({
    owner: address,
    filter: { StructType: Miner.$typeName },
  });
  const [miner] = res.data;
  return miner && miner.data ? miner.data.objectId : null;
}

export async function runner(
  client: SuiClient,
  difficulty: number,
  wallet: Ed25519Keypair,
  minerId: string,
  logger?: (_val: string) => void
) {
  const log = (val: string) => (logger ? logger(val) : null);
  const tag = wallet.toSuiAddress().slice(0, 8);

  const signerBytes = bcs.Address.serialize(wallet.toSuiAddress()).toBytes();

  let currentHash: Uint8Array | null = null;
  let nonce = BigInt(0);
  log("⛏️  Mining started");
  log("🔍 Looking for a valid proof...");
  while (true) {
    await (async () => {
      if (!currentHash) {
        const miner = await Miner.fetch(client, minerId);
        currentHash = new Uint8Array(miner.currentHash);
      }

      const hash = createHash(currentHash, signerBytes, nonce);
      const hashIsValid = validateHash(hash, difficulty);
      if (hashIsValid) {
        const handleEvent = (ev: MineEvent) => {
          switch (ev) {
            case "resetting": {
              break;
            }
            case "retrying": {
              break;
            }
            case "submitting": {
              log("✅ Valid hash found");
              log("📡 Submitting transaction");
              break;
            }
            case "simulating": {
              break;
            }
          }
        };
        const res = await submitProof(
          wallet,
          nonce,
          client,
          minerId,
          handleEvent
        );

        if (!res) {
          return;
        }

        log("🏅 Mining success!");
        log("🔍 Looking for next hash...");
        currentHash = null;
        nonce = BigInt(0);
      } else {
        nonce++;
      }
    })().catch((e) => {
      console.error(tag, e);
      return new Promise((r) => setTimeout(() => r(true), 500));
    });
  }
}

export async function waitUntilReset(client: SuiClient) {
  const bus = await fetchBus(client);

  const threshold = Number(bus.lastReset) + 60000;

  if (Date.now() < threshold) {
    await new Promise((r) => setTimeout(() => r(true), threshold - Date.now()));
  }
}

export function canBeReset(ts: bigint) {
  const threshold = Number(ts) + 60000;

  return Date.now() >= threshold;
}

export async function execReset(
  client: SuiClient,
  wallet: Ed25519Keypair
): Promise<SuiTransactionBlockResponse | null> {
  const bus = await Bus.fetch(client, BUSES[0]);

  const shared = await getSharedVersion(getBus(), client);
  const threshold = Number(bus.lastReset) + 60000;

  if (Date.now() >= threshold) {
    const txb = new TransactionBlock();
    epochReset(txb, {
      config: CONFIG,
      buses: BUSES.map((x) =>
        txb.sharedObjectRef({
          objectId: x,
          mutable: true,
          initialSharedVersion: shared,
        })
      ),
      clock: SUI_CLOCK_OBJECT_ID,
    });

    const preSign = await buildTx(txb, client, wallet);

    const dry = await client.dryRunTransactionBlock({
      transactionBlock: preSign.bytes,
    });

    if (dry.effects.status.status === "failure") {
      const errMsg = dry.effects.status.error;
      if (errMsg) {
        if (errMsg.includes(constants.EResetTooEarly.toString())) {
          return null;
        } else {
          const contractErr = extractError(dry.effects.status);
          throw Error(contractErr ? contractErr : errMsg);
        }
      } else {
        throw Error("Unknown failure");
      }
    }

    const res = await ship(preSign, client, { showObjectChanges: true });

    return res;
  }

  return null;
}

export async function getOrCreateMiner(
  wallet: Ed25519Keypair,
  client: SuiClient
): Promise<string> {
  const pub = wallet.toSuiAddress();
  const proof = await getProof(client, pub);

  if (proof) {
    return proof;
  }

  const txb = new TransactionBlock();
  register(txb);

  const _res = await launch(txb, client, wallet);

  const miningAccount = await getProof(client, pub);

  if (!miningAccount) {
    throw Error("Miner failed to register");
  }

  return miningAccount;
}

export function extractError(status: ExecutionStatus): string | null {
  const errMsg = status.error;
  if (!errMsg) {
    return null;
  }
  const errs = Object.entries(constants);
  const match = errs.find(([_, code]) => errMsg.includes(code.toString()));
  return match ? match[0] : null;
}

export async function getSharedVersion(
  addr: string,
  client: SuiClient
): Promise<string> {
  const configObj = await client.getObject({
    id: addr,
    options: { showOwner: true },
  });
  const owner = configObj?.data?.owner || null;
  const shared =
    // @ts-ignore
    owner && owner.Shared ? owner.Shared : null;
  if (!shared) {
    throw Error("no shared version");
  }
  return shared.initial_shared_version;
}

export async function submitProof(
  wallet: Ed25519Keypair,
  nonce: bigint,
  client: SuiClient,
  miner: string,
  logger?: (_val: MineEvent) => void
): Promise<SuiTransactionBlockResponse | null> {
  const log = (val: MineEvent) => (logger ? logger(val) : null);
  const { bus, status } = await findBus(client);

  switch (status) {
    case BusStatus.MineOk: {
      break;
    }
    case BusStatus.ResetNeeded: {
      log("resetting");
      await execReset(client, wallet);
      return null;
    }
    case BusStatus.RewardsExhausted: {
      log("waiting");
      await waitUntilReset(client);
      return null;
    }
  }

  const txb = await buildMineTx(
    nonce,
    miner,
    client,
    bus,
    wallet.toSuiAddress()
  );

  const signedTx = await buildTx(txb, client, wallet);

  log("simulating");
  const dryRun = await client.dryRunTransactionBlock({
    transactionBlock: signedTx.bytes,
  });

  // TODO refactor
  const shouldRetry = await (async () => {
    if (dryRun.effects.status.status === "failure") {
      const contractErr = extractError(dryRun.effects.status);
      const errMsg = dryRun.effects.status.error || "missing";

      if (errMsg.includes(constants.ENeedsReset.toString())) {
        log("resetting");
        await execReset(client, wallet);
        return true;
      } else if (errMsg.includes(constants.ERewardsExhausted.toString())) {
        return true;
      } else if (contractErr) {
        throw Error(contractErr);
      } else {
        throw Error("Unknown error");
      }
    } else {
      return false;
    }
  })();

  if (shouldRetry) {
    log("retrying");
    return null;
  }

  log("submitting");
  const res = await ship(signedTx, client);

  return res;
}

export interface MineConfig {
  currentHash: Uint8Array;
  signer: Uint8Array;
  difficulty: number;
  initialNonce: number;
}

export interface MineResult {
  currentHash: Uint8Array;
  proof: Uint8Array;
  nonce: bigint;
}

export function formatBig(n: bigint, decimals: number) {
  return numbro(Number(n) / Math.pow(10, decimals)).format({
    mantissa: 9,
    trimMantissa: true,
  });
}
