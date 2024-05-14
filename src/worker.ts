/* eslint-disable fp/no-loops, fp/no-mutation, fp/no-mutating-methods, fp/no-let, no-constant-condition */

import { keccak } from 'hash-wasm';
import {
  MineConfig,
  MineResult,
  validateHash,
  int64to8,
  hexToBytes,
} from './common';

onmessage = async (event) => {
  const config: MineConfig = event.data;
  grind(config);
};

async function grind(config: MineConfig) {
  let nonce = config.initialNonce || BigInt(0);
  const dataToHash = new Uint8Array(32 + 32 + 8);
  dataToHash.set(config.currentHash, 0);
  dataToHash.set(config.signer, 32);
  while (true) {
    dataToHash.set(int64to8(nonce), 64);
    const bts = await keccak(dataToHash, 256);
    const hash = hexToBytes(bts);
    if (validateHash(hash, config.difficulty)) {
      const res: MineResult = {
        currentHash: config.currentHash,
        proof: hash,
        nonce,
      };
      postMessage(res);
      break;
    } else {
      if (nonce % BigInt(1_000_000) == BigInt(0)) {
        postMessage({ checkpoint: nonce, currentHash: config.currentHash });

        // Yield to event loop
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
      nonce++;
    }
  }
}
