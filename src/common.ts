/* eslint-disable fp/no-loops, fp/no-mutation, fp/no-mutating-methods, fp/no-let, no-constant-condition */

import { keccak_256 } from "@noble/hashes/sha3";
import { mine } from "./codegen/mineral/mine/functions";
import { register } from "./codegen/mineral/miner/functions";
import { SUI_CLOCK_OBJECT_ID, MIST_PER_SUI } from "@mysten/sui.js/utils";
import { ProofData } from "./ports";
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
import { SignatureWithBytes } from "@mysten/sui.js/dist/cjs/cryptography";
import { TurbosSdk } from "turbos-clmm-sdk";

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
  | "success"
  | "checkpoint"
  | "waiting";

export const getClient = () => {
  return new SuiClient({
    url: new URL(process.env.RPC!).toString(),
  });
};

export async function calcProfit(sdk: TurbosSdk, amount: bigint) {
  const MINE_GAS_FEE = 811_644;

  const [swap] = await sdk.trade.computeSwapResultV2({
    pools: [
      {
        pool: "0x36f838ab69ea41d959de58dd5b2cb00c9deb7bc1e851a82097b66dfd629f0f3f",
        a2b: true,
        amountSpecified: amount.toString(),
      },
    ],
    address:
      "0x7da95f2a3898d8aabbb9b67fb0130c029c73085340db8b21373c514c608e65fe",
    amountSpecifiedIsInput: true,
  });
  const out =
    Number(swap.amount_b) + Number(swap.protocol_fee) + Number(swap.fee_amount);
  const delta = (out - MINE_GAS_FEE) / Number(MIST_PER_SUI);
  return {
    mineGasFee: MINE_GAS_FEE / Number(MIST_PER_SUI),
    swapOutput: out / Number(MIST_PER_SUI),
    delta,
  };
}

export function fetchBus(client: SuiClient) {
  return Bus.fetch(client, BUSES[0]);
}

export async function findValidBus(client: SuiClient): Promise<Bus | null> {
  const buses = await fetchBuses(client);

  const bus = buses[0];

  if (bus.rewards.value >= bus.rewardRate) {
    const threshold = Number(bus.lastReset) + constants.EPOCH_LENGTH;

    const closeToReset = Date.now() >= threshold - 2_000;

    return closeToReset ? null : bus;
  } else {
    return null;
  }
}

export async function fetchBuses(client: SuiClient): Promise<Bus[]> {
  const objs = await client.multiGetObjects({
    ids: BUSES,
    options: { showContent: true },
  });
  const buses = objs.map((obj) => {
    const bus = Bus.fromFieldsWithTypes(obj.data!.content! as any);
    return bus;
  });

  // Put buses with most rewards to the start
  buses.sort((a, b) => Number(a.rewards.value - b.rewards.value));
  buses.reverse();

  return buses;
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

  //const _exec = await client.waitForTransactionBlock({
  //digest: res.digest,
  //});

  return res;
}

export function buildTx(
  txb: TransactionBlock,
  client: SuiClient,
  wallet: Ed25519Keypair,
  gas: number | null
): Promise<SignatureWithBytes> {
  txb.setSender(wallet.toSuiAddress());
  if (gas) {
    txb.setGasBudget(gas);
  }
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
  const drySign = await buildTx(txb, client, wallet, null);

  const dryRun = await client.dryRunTransactionBlock({
    transactionBlock: drySign.bytes,
  });

  if (dryRun.effects.status.status === "failure") {
    const contractErr = extractError(dryRun.effects.status);
    throw Error(contractErr || "Unknown failure");
  }

  const gasUsed =
    Number(dryRun.effects.gasUsed.computationCost) +
    //Number(dryRun.effects.gasUsed.nonRefundableStorageFee) +
    Number(dryRun.effects.gasUsed.storageCost);
  const preSign = await buildTx(txb, client, wallet, gasUsed);

  const res = await client.executeTransactionBlock({
    transactionBlock: preSign.bytes,
    signature: preSign.signature,
    //options: opts,
  });

  const _exec = await client.waitForTransactionBlock({
    digest: res.digest,
  });

  return res;
}

export async function buildMineTx(
  nonce: bigint,
  minerId: string,
  client: SuiClient,
  bus: Bus,
  payer: string,
  coinObject?: string
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
  if (coinObject) {
    txb.mergeCoins(coinObject, [createdObj]);
  } else {
    txb.transferObjects([createdObj], payer);
  }
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
  return keccak_256(dataToHash);
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
  client: SuiClient,
  proofData: ProofData,
  bus: Bus,
  progressHandler: (_val: MineEvent) => void
): Promise<SuiTransactionBlockResponse> {
  const txb = await buildMineTx(
    BigInt(proofData.proof.nonce),
    proofData.miner,
    client,
    bus,
    wallet.toSuiAddress(),
    proofData.coinObject || undefined
  );

  const signedTx = await buildTx(txb, client, wallet, 5000000);

  progressHandler("simulating");
  const _dryRun = await client.dryRunTransactionBlock({
    transactionBlock: signedTx.bytes,
  });

  progressHandler("submitting");
  const res = await ship(signedTx, client);

  await waitUntilNextHash(client, proofData.miner, proofData.proof.currentHash);

  return res;
}

export interface MineConfig {
  currentHash: Uint8Array;
  signer: Uint8Array;
  difficulty: number;
  initialNonce: bigint;
}

export interface MineResult {
  currentHash: Uint8Array;
  proof: Uint8Array;
  nonce: bigint;
}

export function snooze(n: number) {
  return new Promise((r) => setTimeout(() => r(true), n));
}

export async function waitUntilNextEpoch(client: SuiClient) {
  const bus = await fetchBus(client);
  const lastReset = bus.lastReset;
  const nextReset = Number(bus.lastReset) + constants.EPOCH_LENGTH;
  const timeUntilNextReset = nextReset - Date.now();
  await snooze(timeUntilNextReset);
  while (true) {
    const freshBus = await fetchBus(client);
    if (freshBus.lastReset !== lastReset) {
      break;
    } else {
      await snooze(1500);
    }
  }
}

export async function waitUntilNextHash(
  client: SuiClient,
  miner: string,
  currentHash: number[]
) {
  let current = currentHash.join();
  let attempts = 0;
  while (attempts < 5) {
    const minerObj = await Miner.fetch(client, miner);
    if (minerObj.currentHash.join() !== current) {
      break;
    } else {
      attempts += 1;
      await snooze(1500);
    }
  }
}
