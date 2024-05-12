/* eslint-disable fp/no-loops, fp/no-mutation, fp/no-mutating-methods, fp/no-let, no-constant-condition */

import { MineConfig, MineResult, createHash, validateHash } from "./common";

let config: MineConfig | null = null;

onmessage = async (event) => {
  const startGrind = !config;

  // Update config
  config = event.data;

  if (startGrind) {
    grind();
  }
};

async function grind() {
  if (!config) {
    return;
  }
  let currentHash = config.currentHash;
  let proof: Uint8Array | null = null;
  let nonce = BigInt(0);
  while (true) {
    // Config has changed
    if (currentHash !== config.currentHash) {
      nonce = BigInt(config.initialNonce || 0);
      currentHash = config.currentHash;
      proof = null;
    }
    // Proof is still being processed
    if (proof) {
      await new Promise((r) => setTimeout(() => r(true), 300));
      continue;
    }
    const hash = createHash(config.currentHash, config.signer, nonce);
    if (validateHash(hash, config.difficulty)) {
      const res: MineResult = { currentHash, proof: hash, nonce };
      postMessage(res);
      proof = hash;
    }
    nonce++;
  }
}
