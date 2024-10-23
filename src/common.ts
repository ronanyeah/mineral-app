/* eslint-disable fp/no-loops, fp/no-mutation, fp/no-mutating-methods, fp/no-let, no-constant-condition */

import { keccak_256 } from "@noble/hashes/sha3";
import { SignatureWithBytes } from "@mysten/sui/cryptography";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { SUI_CLOCK_OBJECT_ID, MIST_PER_SUI } from "@mysten/sui/utils";
import { Transaction } from "@mysten/sui/transactions";
import {
  TransactionEffects,
  ExecutionStatus,
  SuiClient,
  SuiTransactionBlockResponse,
} from "@mysten/sui/client";

import { ProofData } from "./ports";
import * as constants from "./constants";

import { mine } from "./codegen/mineral/mine/functions";
import { register } from "./codegen/mineral/miner/functions";
import { Bus } from "./codegen/mineral/mine/structs";
import { Miner } from "./codegen/mineral/miner/structs";

export const getClient = () => {
  return new SuiClient({
    url: new URL(process.env.RPC!).toString(),
  });
};

export function fetchBus(client: SuiClient) {
  return Bus.fetch(
    client,
    constants.BUSES[Math.floor(Math.random() * constants.BUSES.length)]
  );
}

export async function findValidBus(client: SuiClient): Promise<Bus | null> {
  const buses = await fetchBuses(client);

  const bus = buses[0];

  if (bus.rewards.value >= bus.rewardRate) {
    const threshold = Number(bus.lastReset) + constants.EPOCH_LENGTH;

    const buffer = 8_000;
    const closeToReset = Date.now() >= threshold - buffer;

    return closeToReset ? null : bus;
  } else {
    return null;
  }
}

export async function fetchBuses(client: SuiClient): Promise<Bus[]> {
  const objs = await client.multiGetObjects({
    ids: constants.BUSES,
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

export async function estimateGasAndSubmit(
  txb: Transaction,
  client: SuiClient,
  wallet: Ed25519Keypair
): Promise<SuiTransactionBlockResponse> {
  const drySign = await signTx(txb, client, wallet, null);

  const dryRun = await client.dryRunTransactionBlock({
    transactionBlock: drySign.bytes,
  });

  handleTxError(dryRun.effects);

  const gasUsed =
    Number(dryRun.effects.gasUsed.computationCost) +
    Number(dryRun.effects.gasUsed.storageCost) -
    Number(dryRun.effects.gasUsed.storageRebate);

  const signedTx = await signTx(txb, client, wallet, Math.max(0, gasUsed));

  const res = await client.executeTransactionBlock({
    transactionBlock: signedTx.bytes,
    signature: signedTx.signature,
    options: { showEffects: true },
  });

  if (!res.effects) {
    throw Error("Tx effects missing");
  }

  handleTxError(res.effects);

  return res;
}

export function signTx(
  txb: Transaction,
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

export function handleTxError(effects: TransactionEffects) {
  if (effects.status.status === "failure") {
    throw Error(
      effects.status.error || `Unknown failure: ${effects.transactionDigest}`
    );
  }
}

export function handleMineralError(effects: TransactionEffects) {
  if (effects.status.status === "failure") {
    const contractErr = extractError(effects.status);
    throw Error(
      contractErr ||
        effects.status.error ||
        `Unknown failure: ${effects.transactionDigest}`
    );
  }
}

export async function launch(
  txb: Transaction,
  client: SuiClient,
  wallet: Ed25519Keypair,
  gas: number
): Promise<SuiTransactionBlockResponse> {
  const signedTx = await signTx(txb, client, wallet, gas);

  const res = await client.executeTransactionBlock({
    transactionBlock: signedTx.bytes,
    signature: signedTx.signature,
    options: { showEffects: true },
  });

  return res;
}

export function buildMineTx(
  proofData: ProofData,
  busId: string,
  payer: string
): Transaction {
  const txb = new Transaction();
  const [createdObj] = mine(txb, {
    nonce: BigInt(proofData.proof.nonce),
    bus: txb.sharedObjectRef({
      objectId: busId,
      mutable: true,
      initialSharedVersion: 0,
    }),
    clock: SUI_CLOCK_OBJECT_ID,
    miner: proofData.miner,
  });
  if (proofData.coinObject) {
    txb.mergeCoins(proofData.coinObject, [createdObj]);
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
): Promise<Miner | null> {
  const res = await client.getOwnedObjects({
    owner: address,
    filter: { StructType: Miner.$typeName },
    options: { showContent: true },
  });
  const [miner] = res.data;
  return miner && miner.data && miner.data.content
    ? Miner.fromSuiParsedData(miner.data.content)
    : null;
}

export async function getOrCreateMiner(
  wallet: Ed25519Keypair,
  client: SuiClient
): Promise<Miner> {
  const pub = wallet.toSuiAddress();
  const proof = await getProof(client, pub);

  if (proof) {
    return proof;
  }

  const txb = new Transaction();
  register(txb);

  const _res = await estimateGasAndSubmit(txb, client, wallet);

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

export async function submitProof(
  wallet: Ed25519Keypair,
  client: SuiClient,
  proofData: ProofData,
  bus: Bus
): Promise<SuiTransactionBlockResponse> {
  const txb = buildMineTx(proofData, bus.id, wallet.toSuiAddress());

  const res = await launch(
    txb,
    client,
    wallet,
    proofData.coinObject ? 1_000_000 : 2_500_000
  );

  if (!res.effects) {
    throw Error("Tx effects missing");
  }
  handleMineralError(res.effects);

  await waitUntilNextHash(client, proofData.miner, proofData.proof.currentHash);

  return res;
}

export interface MineProgress {
  nonce: bigint;
  hash: Uint8Array;
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
  if (timeUntilNextReset > 0) {
    await snooze(timeUntilNextReset);
  }
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
      return;
    } else {
      attempts += 1;
      await snooze(2000);
    }
  }
  throw Error("Failed to acquire new hash");
}
