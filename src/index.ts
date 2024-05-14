/* eslint-disable fp/no-loops, fp/no-mutation, fp/no-mutating-methods, fp/no-let, no-constant-condition */

import {
  MineEvent,
  submitProof,
  MineConfig,
  getProof,
  getOrCreateMiner,
  MineResult,
  fetchBus,
  CONFIG,
} from "./common";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { bcs } from "@mysten/sui.js/bcs";
import { Stats, ElmApp, Balances } from "./ports";
import { decodeSuiPrivateKey } from "@mysten/sui.js/cryptography";
import { SuiClient } from "@mysten/sui.js/client";
import { SUI_TYPE_ARG } from "@mysten/sui.js/utils";
import { MINE, Config } from "./codegen/mineral/mine/structs";
import { Miner } from "./codegen/mineral/miner/structs";

const { Elm } = require("./Main.elm");

const WALLET_KEY = "WALLET";
const MINE_KEY = "MINOOOR";

const RPCS = [
  "https://fullnode.mainnet.sui.io:443",
  "https://mainnet.suiet.app",
  "https://sui-mainnet-us-1.cosmostation.io",
  "https://sui-mainnet-endpoint.blockvision.org",
  "https://sui-mainnet.public.blastapi.io",
  "https://sui-mainnet-rpc.allthatnode.com",
  "https://sui-mainnet-eu-3.cosmostation.io",
  "https://sui1mainnet-rpc.chainode.tech",
  "https://mainnet.sui.rpcpool.com",
  "https://sui-mainnet-ca-2.cosmostation.io",
];

const RPC = RPCS[Math.floor(Math.random() * RPCS.length)];

const provider = new SuiClient({
  url: RPC,
});

let worker: Worker | null = null;

function recoverWallet(): Ed25519Keypair | null {
  const val = localStorage.getItem(WALLET_KEY);
  if (!val) {
    return null;
  }
  const decoded = decodeSuiPrivateKey(val);

  return Ed25519Keypair.fromSecretKey(decoded.secretKey);
}

function recoverMiningProgress(): { nonce: bigint; hash: Uint8Array } | null {
  const val = localStorage.getItem(MINE_KEY);
  if (!val) {
    return null;
  }
  const decoded = JSON.parse(val);

  return { nonce: BigInt(decoded.nonce), hash: new Uint8Array(decoded.hash) };
}

function persistMiningProgress({
  nonce,
  hash,
}: {
  nonce: bigint;
  hash: Uint8Array;
}) {
  localStorage.setItem(
    MINE_KEY,
    JSON.stringify({
      nonce: nonce.toString(),
      hash: Array.from(hash),
    })
  );
}

(async () => {
  let wallet = recoverWallet();
  const app: ElmApp = Elm.Main.init({
    node: document.getElementById("app"),
    flags: {
      time: Date.now(),
      wallet: wallet
        ? { pub: wallet.toSuiAddress(), pvt: wallet.getSecretKey() }
        : null,
    },
  });

  app.ports.fetchStats.subscribe(() =>
    (async () => {
      const [bus, config] = await Promise.all([
        fetchBus(provider),
        Config.fetch(provider, CONFIG),
      ]);
      const stats: Stats = {
        totalHashes: Number(config.totalHashes),
        totalRewards: Number(config.totalRewards),
        rewardRate: Number(bus.rewardRate),
      };
      app.ports.statsCb.send(stats);
    })().catch((e) => {
      console.error(e);
    })
  );

  app.ports.clearWallet.subscribe(() => {
    wallet = null;
    localStorage.removeItem(WALLET_KEY);
  });

  app.ports.registerMiner.subscribe(() =>
    (async () => {
      if (!wallet) {
        return;
      }

      const proof = await getOrCreateMiner(wallet, provider);
      const _miner = await Miner.fetch(provider, proof);

      return app.ports.minerCreatedCb.send({
        address: proof,
        claims: 0,
      });
    })().catch((e) => {
      console.error(e);
    })
  );

  app.ports.refreshTokens.subscribe(() =>
    (async () => {
      if (!wallet) {
        return app.ports.balancesCb.send(null);
      }
      const balances = await fetchBalances(provider, wallet.toSuiAddress());
      app.ports.balancesCb.send(balances);
    })().catch((e) => {
      console.error(e);
      app.ports.balancesCb.send(null);
    })
  );

  app.ports.importWallet.subscribe((privateKey) =>
    (async () => {
      const kp = privateKey
        ? Ed25519Keypair.fromSecretKey(
            decodeSuiPrivateKey(privateKey).secretKey
          )
        : new Ed25519Keypair();

      localStorage.setItem(WALLET_KEY, kp.getSecretKey());
      wallet = kp;

      const pub = kp.toSuiAddress();
      app.ports.walletCb.send({ pub, pvt: kp.getSecretKey() });
      const proof = await getProof(provider, pub);
      if (proof) {
        app.ports.minerAccountCb.send({
          address: proof,
          claims: 0,
        });
        await updateBalances(app, provider, pub);
      } else {
        const balances = await fetchBalances(provider, pub);
        app.ports.balancesCb.send(balances);
      }
    })().catch((e) => {
      console.error(e);
    })
  );

  app.ports.stopMining.subscribe(() => {
    if (worker) {
      worker.terminate();
      worker = null;
    }
  });

  app.ports.copy.subscribe((val) => {
    navigator.clipboard.writeText(val);
  });

  if (wallet) {
    (async () => {
      const proof = await getProof(provider, wallet.toSuiAddress());
      if (proof) {
        console.log("mining account loaded");
        await updateBalances(app, provider, wallet.toSuiAddress());
      } else {
        console.log("no mining account");
        const balances = await fetchBalances(provider, wallet.toSuiAddress());
        app.ports.balancesCb.send(balances);
      }
    })().catch(console.error);
  }

  app.ports.claim.subscribe((_) =>
    (async () => {
      //
    })().catch((e) => {
      console.error(e);
      app.ports.claimCb.send({ err: e.toString() });
    })
  );

  app.ports.submitProof.subscribe(({ proof, miner }) =>
    (async () => {
      console.log("start submit");
      if (!wallet) {
        return;
      }
      const nonce = BigInt(proof.nonce);

      const handleEvent = (ev: MineEvent) => {
        switch (ev) {
          case "submitting": {
            console.log("submitting transaction...");
            app.ports.statusCb.send("3");
            break;
          }
          default: {
            console.log(ev);
          }
        }
      };
      const res = await submitProof(
        wallet,
        nonce,
        provider,
        miner,
        handleEvent
      );

      if (!res) {
        console.log("retrying");
        return app.ports.retrySubmitProof.send({ proof, miner });
      }

      console.log("Mining success!", res.digest);
      app.ports.statusCb.send("4");

      // Clear progress tracker
      localStorage.removeItem(MINE_KEY);

      updateBalances(app, provider, wallet.toSuiAddress()).catch(console.error);
    })().catch((e) => {
      console.error(e);
      app.ports.miningError.send(String(e));
    })
  );

  app.ports.mine.subscribe((miningAccount) =>
    (async () => {
      if (!wallet) {
        return;
      }
      const bus = await fetchBus(provider);
      if (!worker) {
        worker = new Worker("/worker.js", { type: "module" });

        worker.onmessage = (e) =>
          (async () => {
            if (!wallet) {
              // TODO should stop worker
              throw Error("Wallet unavailable");
            }

            if ("checkpoint" in e.data) {
              app.ports.hashCountCb.send(Number(e.data.checkpoint));
              return persistMiningProgress({
                nonce: e.data.checkpoint,
                hash: e.data.currentHash,
              });
            }

            if ("proof" in e.data) {
              const mineRes: MineResult = e.data;
              console.log("proof solved with nonce:", mineRes.nonce.toString());
              app.ports.statusCb.send("2");
              if (worker) {
                worker.terminate();
                worker = null;
              }
              return app.ports.proofCb.send({
                currentHash: Array.from(mineRes.currentHash),
                nonce: Number(mineRes.nonce),
              });
            }

            // TODO should stop worker
            throw Error("Unknown worker response");
          })().catch(
            //TODO handle crash
            console.error
          );
        worker.onerror = (e) => {
          console.error(e);
        };
      }

      const mineConfig = await buildMiningConfig(
        wallet.toSuiAddress(),
        miningAccount,
        bus.difficulty
      );
      console.log("starting mine");

      worker.postMessage(mineConfig);
    })().catch((e) => {
      console.error(e);
    })
  );
})().catch(console.error);

async function fetchBalances(
  client: SuiClient,
  address: string
): Promise<Balances> {
  const [mineralBalance, suiBalance] = await Promise.all([
    client.getBalance({
      owner: address,
      coinType: MINE.$typeName,
    }),
    client.getBalance({
      owner: address,
      coinType: SUI_TYPE_ARG,
    }),
  ]);
  return {
    mineral: Number(mineralBalance.totalBalance),
    sui: Number(suiBalance.totalBalance),
  };
}

async function updateBalances(app: ElmApp, client: SuiClient, address: string) {
  const balances = await fetchBalances(client, address);
  app.ports.balancesCb.send(balances);
}

async function buildMiningConfig(
  addr: string,
  miningAccount: string,
  difficulty: number
): Promise<MineConfig> {
  const miner = await Miner.fetch(provider, miningAccount);
  const progress = recoverMiningProgress();
  const initialNonce = (() => {
    if (!progress) {
      return BigInt(0);
    }
    if (progress.hash.toString() === miner.currentHash.toString()) {
      return progress.nonce;
    } else {
      localStorage.removeItem(MINE_KEY);
      return BigInt(0);
    }
  })();
  console.log("Starting nonce:", initialNonce.toString());
  return {
    currentHash: new Uint8Array(miner.currentHash),
    signer: bcs.Address.serialize(addr).toBytes(),
    difficulty: difficulty,
    initialNonce,
  };
}
