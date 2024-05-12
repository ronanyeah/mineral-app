/* eslint-disable fp/no-loops, fp/no-mutation, fp/no-mutating-methods, fp/no-let, no-constant-condition */

import {
  MineEvent,
  submitProof,
  MineConfig,
  getProof,
  getOrCreateMiner,
  MineResult,
  fetchBus,
} from "./common";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { bcs } from "@mysten/sui.js/bcs";
import { ElmApp, Balances } from "./ports";
import { decodeSuiPrivateKey } from "@mysten/sui.js/cryptography";
import { SuiClient } from "@mysten/sui.js/client";
import { SUI_TYPE_ARG } from "@mysten/sui.js/utils";
import { MINE } from "./codegen/mineral/mine/structs";
import { Miner } from "./codegen/mineral/miner/structs";

const { Elm } = require("./Main.elm");

const WALLET_KEY = "WALLET";

/* eslint-disable no-undef */
// @ts-ignore
const RPC = __RPC_URL;
/* eslint-enable no-undef */

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
              // TODO
              throw Error("Wallet unavailable");
            }

            if (e.data.proof) {
              const mineRes: MineResult = e.data;
              console.log("proof solved with nonce:", mineRes.nonce.toString());
              app.ports.statusCb.send("2");
              return app.ports.proofCb.send({
                currentHash: Array.from(mineRes.currentHash),
                nonce: Number(mineRes.nonce),
              });
            }

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
  return {
    currentHash: new Uint8Array(miner.currentHash),
    signer: bcs.Address.serialize(addr).toBytes(),
    difficulty: difficulty,
    initialNonce: 0,
  };
}
