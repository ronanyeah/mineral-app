/* eslint-disable fp/no-loops, fp/no-mutation, fp/no-mutating-methods, fp/no-let, no-constant-condition */

import {
  calcProfit,
  MineEvent,
  submitProof,
  MineConfig,
  getProof,
  getOrCreateMiner,
  MineResult,
  fetchBus,
  CONFIG,
  launch,
  findValidBus,
  waitUntilNextEpoch,
} from "./common";
import { Network, TurbosSdk } from "turbos-clmm-sdk";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { bcs } from "@mysten/sui.js/bcs";
import { Stats, ElmApp, Balances } from "./ports";
import { decodeSuiPrivateKey } from "@mysten/sui.js/cryptography";
import { SuiClient } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { SUI_TYPE_ARG } from "@mysten/sui.js/utils";
import { MINE, Config } from "./codegen/mineral/mine/structs";
import { Miner } from "./codegen/mineral/miner/structs";

const { Elm } = require("./Main.elm");

const WALLET_KEY = "WALLET";
const MINE_KEY = "MINOOOR";

const RPCS = [
  //"https://sui-mainnet-rpc.allthatnode.com",
  //"https://sui-mainnet-endpoint.blockvision.org",
  "https://fullnode.mainnet.sui.io:443",
  "https://mainnet.suiet.app",
  "https://sui-mainnet-us-1.cosmostation.io",
  "https://sui-mainnet.public.blastapi.io",
  "https://sui-mainnet-eu-3.cosmostation.io",
  "https://sui1mainnet-rpc.chainode.tech",
  "https://mainnet.sui.rpcpool.com",
  "https://sui-mainnet-ca-2.cosmostation.io",
];

const RPC = RPCS[Math.floor(Math.random() * RPCS.length)];

const provider = new SuiClient({
  url: RPC,
});

const sdk = new TurbosSdk(Network.mainnet);

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
      rpc: [RPC, RPCS],
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
      const rtns = await calcProfit(sdk, bus.rewardRate);
      app.ports.swapDataCb.send(rtns);
    })().catch((e) => {
      console.error(e);
    })
  );

  app.ports.clearWallet.subscribe(() => {
    wallet = null;
    localStorage.removeItem(WALLET_KEY);
    localStorage.removeItem(MINE_KEY);
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
      await updateBalances(app, provider, wallet.toSuiAddress());
    })().catch((e) => {
      console.error(e);
      app.ports.balancesCb.send(null);
    })
  );

  app.ports.combineCoins.subscribe(() =>
    (async () => {
      if (wallet) {
        const coins = await fetchMineral(provider, wallet.toSuiAddress());

        const txb = new TransactionBlock();
        txb.mergeCoins(
          coins[0].coinObjectId,
          coins.slice(1).map((coin) => coin.coinObjectId)
        );
        const _sig = await launch(txb, provider, wallet);
        updateBalances(app, provider, wallet.toSuiAddress());
      }
    })().catch((e) => {
      console.error(e);
      alert(e.message);
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
      const minerObjectAddress = await getProof(provider, pub);
      app.ports.walletCb.send({
        address: pub,
        privateKey: kp.getSecretKey(),
        balances: null,
        miningAccount: minerObjectAddress
          ? {
              address: minerObjectAddress,
              claims: 0,
            }
          : null,
      });
      await updateBalances(app, provider, pub);
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
    updateBalances(app, provider, wallet.toSuiAddress()).catch(console.error);
  }

  app.ports.claim.subscribe((_) =>
    (async () => {
      //
    })().catch((e) => {
      console.error(e);
      app.ports.claimCb.send({ err: e.toString() });
    })
  );

  app.ports.submitProof.subscribe((proofData) =>
    (async () => {
      console.log("start submit");
      if (!wallet) {
        return;
      }
      const handleEvent = (ev: MineEvent) => {
        switch (ev) {
          case "submitting": {
            console.log("submitting transaction...");
            app.ports.statusCb.send(3);
            break;
          }
          default: {
            console.log(ev);
          }
        }
      };
      const validBus = await findValidBus(provider);
      if (!validBus) {
        app.ports.statusCb.send(5);
        await waitUntilNextEpoch(provider);
        console.log("retrying");
        return app.ports.retrySubmitProof.send(proofData);
      }
      const res = await submitProof(
        wallet,
        provider,
        proofData,
        validBus,
        handleEvent
      );

      console.log("Mining success!", res.digest);
      app.ports.statusCb.send(4);

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
              app.ports.statusCb.send(2);
              if (worker) {
                worker.terminate();
                worker = null;
              }
              return app.ports.proofCb.send({
                currentHash: Array.from(mineRes.currentHash),
                nonce: Number(mineRes.nonce),
              });
            }

            throw Error("Unknown worker response");
          })().catch((e) => {
            console.error(e);
            app.ports.miningError.send("Message handling failure");
          });
        worker.onerror = (e) => {
          console.error(e);
          app.ports.miningError.send("Worker error");
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
  const [mineralObjs, suiBalance] = await Promise.all([
    client.getCoins({
      coinType: MINE.$typeName,
      owner: address,
    }),
    client.getBalance({
      owner: address,
      coinType: SUI_TYPE_ARG,
    }),
  ]);

  mineralObjs.data.sort((a, b) => Number(a.balance) - Number(b.balance));
  mineralObjs.data.reverse();
  const largestBalance = mineralObjs.data[0];

  const mineralBalance = mineralObjs.data.reduce(
    (acc, obj) => acc + BigInt(obj.balance),
    BigInt(0)
  );

  return {
    coinObject: largestBalance ? largestBalance.coinObjectId : null,
    mineralObjects: mineralObjs.data.length,
    mineral: Number(mineralBalance),
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

async function fetchMineral(client: SuiClient, address: string) {
  const res = await client.getCoins({
    coinType: MINE.$typeName,
    owner: address,
  });
  const coins = res.data;
  coins.sort((a, b) => Number(a.balance) - Number(b.balance));
  coins.reverse();
  return coins;
}
