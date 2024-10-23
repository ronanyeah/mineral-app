import "./index.css";

import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { bcs } from "@mysten/sui/bcs";
import { decodeSuiPrivateKey } from "@mysten/sui/cryptography";
import { SuiClient } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { SUI_TYPE_ARG } from "@mysten/sui/utils";
import { MINE } from "./codegen/mineral/mine/structs";
import { Miner } from "./codegen/mineral/miner/structs";

import { ElmApp, Balances, Flags } from "./ports";
import {
  estimateGasAndSubmit,
  submitProof,
  MineConfig,
  getProof,
  getOrCreateMiner,
  MineResult,
  fetchBus,
  findValidBus,
  waitUntilNextEpoch,
  MineProgress,
} from "./common";
const sweep: any = {};
// todo
//import * as sweep from "./sweep";
//import * as walletSelect from "./walletSelect";
//import { WebSocketClient } from "./lib";

const { Elm } = require("./Main.elm");

const WALLET_KEY = "WALLET";
const MINE_KEY = "MINOOOR";
const SPECTATOR_KEY = "SPECTATOOOR";

// @ts-expect-error
const backend: string = BACKEND;

// todo
const walletHooks: any = {};
//const walletHooks: walletSelect.WalletHooks = {
//currentWallet: null,
//signMsg: null,
//setModalOpen: null,
//disconnectWallet: null,
//signTx: null,
//};

const RPCS = [
  "https://fullnode.mainnet.sui.io:443",
  "https://mainnet.suiet.app",
  "https://rpc-mainnet.suiscan.xyz",
  "https://mainnet.sui.rpcpool.com",
  "https://sui-mainnet.nodeinfra.com",
  "https://mainnet-rpc.sui.chainbase.online",
  "https://sui-mainnet-ca-1.cosmostation.io",
  "https://sui-mainnet-ca-2.cosmostation.io",
  "https://sui-mainnet-us-1.cosmostation.io",
  "https://sui-mainnet-us-2.cosmostation.io",
];

const RPC = RPCS[Math.floor(Math.random() * RPCS.length)];

const provider = new SuiClient({
  url: RPC,
});

let worker: Worker | null = null;

(async () => {
  let wallet = recoverWallet();
  //const spectatorId = recoverSpectatorId();
  const spectatorId = "123";

  const flags: Flags = {
    backend,
    rpc: [RPC, RPCS],
    time: Date.now(),
    screen: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    spectatorId,
    wallet: wallet
      ? { pub: wallet.toSuiAddress(), pvt: wallet.getSecretKey() }
      : null,
  };
  const app: ElmApp = Elm.Main.init({
    node: document.getElementById("app"),
    flags,
  });

  ////  ports registration start

  //const ws = new WebSocketClient(app, "ws://localhost:8888/api/ws");
  const ws: any = {};

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

      const miner = await getOrCreateMiner(wallet, provider);

      return app.ports.minerCreatedCb.send({
        address: miner.id,
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

        const txb = new Transaction();
        txb.mergeCoins(
          coins[0].coinObjectId,
          coins.slice(1).map((coin) => coin.coinObjectId)
        );
        const _sig = await estimateGasAndSubmit(txb, provider, wallet);
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
      const miner = await getProof(provider, pub);
      app.ports.walletCb.send({
        address: pub,
        privateKey: kp.getSecretKey(),
        balances: null,
        miningAccount: miner
          ? {
              address: miner.id,
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

  app.ports.submitProof.subscribe((proofData) =>
    (async () => {
      console.log("start submit");
      if (!wallet) {
        return;
      }
      const validBus = await findValidBus(provider);
      if (!validBus) {
        app.ports.statusCb.send(5);
        await waitUntilNextEpoch(provider);
        console.log("retrying");
        return app.ports.retrySubmitProof.send(proofData);
      }

      console.log("submitting transaction...");
      app.ports.statusCb.send(3);
      const res = await submitProof(wallet, provider, proofData, validBus);

      console.log("Mining success!", res.digest);
      app.ports.statusCb.send(4);

      updateBalances(app, provider, wallet.toSuiAddress()).catch(console.error);
    })().catch((e) => {
      console.error(e);
      app.ports.proofSubmitError.send(String(e));
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
              persistMiningProgress({
                nonce: mineRes.nonce,
                hash: mineRes.currentHash,
              });
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

  app.ports.connectWallet.subscribe((_) =>
    (async () => {
      walletHooks.setModalOpen!(true);
    })().catch((e) => {
      console.error(e);
    })
  );

  app.ports.joinGame.subscribe(() =>
    (async () => {
      const txb = new Transaction();
      sweep.joinGame(txb);

      const signed = await walletHooks.signTx!({
        transaction: txb,
        chain: "sui:testnet",
      });
      app.ports.signedCb.send(signed);
    })().catch((e) => {
      console.error(e);
    })
  );

  app.ports.claimPrize.subscribe(() =>
    (async () => {
      const txb = new Transaction();
      const [coin] = sweep.claim(txb);
      txb.transferObjects([coin], walletHooks.currentWallet!);
      //const _res = await submitTx(txb);
    })().catch((e) => {
      console.error(e);
    })
  );

  app.ports.selectSquare.subscribe(({ square, verify }) =>
    (async () => {
      const txb = new Transaction();
      if (verify) {
        sweep.verifyChoice(txb);
      }
      sweep.selectSquare(txb, square.x, square.y);

      const signed = await walletHooks.signTx!({
        transaction: txb,
        chain: "sui:testnet",
      });
      app.ports.signedCb.send(signed);
    })().catch((e) => {
      console.error(e);
    })
  );

  app.ports.log.subscribe((txt) => console.log(txt));

  app.ports.disconnect.subscribe(() => {
    walletHooks.disconnectWallet!();
  });

  app.ports.boardBytes.subscribe((bts) =>
    (async () => {
      const board = sweep.parseBoard(bts);
      app.ports.boardCb.send(sweep.buildBoard(board));
    })().catch((e) => {
      console.error(e);
    })
  );

  app.ports.wsConnect.subscribe((shouldConnect) =>
    (async () => {
      if (shouldConnect) {
        ws.connect();
      } else {
        ws.close();
      }
    })().catch((e) => {
      console.error(e);
    })
  );

  ////  ports registration end

  // todo
  //walletSelect.init(SUI_TESTNET, walletHooks);

  if (wallet) {
    updateBalances(app, provider, wallet.toSuiAddress()).catch(console.error);
  }

  document.addEventListener("walletChange", async (event) => {
    const currentAccount = (<CustomEvent>event).detail.wallet;
    if (currentAccount) {
      app.ports.connectCb.send(currentAccount.address);
    } else {
      app.ports.connectCb.send(null);
    }
  });
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

function recoverWallet(): Ed25519Keypair | null {
  const val = localStorage.getItem(WALLET_KEY);
  if (!val) {
    return null;
  }
  const decoded = decodeSuiPrivateKey(val);

  return Ed25519Keypair.fromSecretKey(decoded.secretKey);
}

function recoverMiningProgress(): MineProgress | null {
  const val = localStorage.getItem(MINE_KEY);
  if (!val) {
    return null;
  }
  const decoded = JSON.parse(val);

  return { nonce: BigInt(decoded.nonce), hash: new Uint8Array(decoded.hash) };
}

function persistMiningProgress(data: MineProgress) {
  localStorage.setItem(
    MINE_KEY,
    JSON.stringify({
      nonce: data.nonce.toString(),
      hash: Array.from(data.hash),
    })
  );
}
