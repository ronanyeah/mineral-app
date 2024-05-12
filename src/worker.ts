/* eslint-disable fp/no-loops, fp/no-mutation, fp/no-mutating-methods, fp/no-let, no-constant-condition */

import { MineConfig, MineResult, createHash, validateHash } from "./common";

onmessage = async (event) => {
  const config: MineConfig = event.data;
  grind(config);
};

async function grind(config: MineConfig) {
  let proof: Uint8Array | null = null;
  let nonce = config.initialNonce || BigInt(0);
  while (!proof) {
    const hash = createHash(config.currentHash, config.signer, nonce);
    if (validateHash(hash, config.difficulty)) {
      proof = hash;
      const res: MineResult = {
        currentHash: config.currentHash,
        proof: hash,
        nonce,
      };
      postMessage(res);
    } else {
      if (nonce % BigInt(1_000_000) == BigInt(0)) {
        postMessage({ checkpoint: nonce, currentHash: config.currentHash });
      }
      nonce++;
    }
  }
}
