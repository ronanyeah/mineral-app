/* eslint-disable fp/no-loops, fp/no-mutation, fp/no-mutating-methods, fp/no-let, no-constant-condition */

import { program } from "commander";
import { Bus } from "../codegen/mineral/mine/structs";
import * as constants from "../constants";
import { SUI_CLOCK_OBJECT_ID } from "@mysten/sui.js/utils";
import { epochReset } from "../codegen/mineral/mine/functions";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import {
  launch,
  handleMineralError,
  validateHash,
  createHash,
  MineEvent,
  getProof,
  getOrCreateMiner,
  fetchBus,
  snooze,
  submitProof,
  fetchBuses,
} from "../common";
import { Config, MINE } from "../codegen/mineral/mine/structs";
import numbro from "numbro";
import { bcs } from "@mysten/sui.js/bcs";
import { Miner } from "../codegen/mineral/miner/structs";
import { decodeSuiPrivateKey } from "@mysten/sui.js/cryptography";
import {
  SuiTransactionBlockResponse,
  SuiClient,
  getFullnodeUrl,
} from "@mysten/sui.js/client";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { SUI_TYPE_ARG, SUI_DECIMALS } from "@mysten/sui.js/utils";
import chalk from "chalk";

const { WALLET, RPC } = process.env;

// Use typescript-eslint or varsIgnorePattern
/* eslint-disable no-unused-vars */
enum BusStatus {
  MineOk,
  RewardsExhausted,
  ResetNeeded,
}
/* eslint-enable no-unused-vars */

const START_TIME = 1715534935000;
const USAGE_GUIDE =
  "https://github.com/ronanyeah/mineral-app/blob/master/cli/README.md";
const SETUP_PROMPT =
  "Wallet not found. Consult the setup guide: " + USAGE_GUIDE;

const settings = (() => {
  return {
    wallet: (() => {
      if (!WALLET) {
        return null;
      }
      return Ed25519Keypair.fromSecretKey(
        decodeSuiPrivateKey(WALLET).secretKey
      );
    })(),
    rpc: new SuiClient({
      url: RPC || getFullnodeUrl("mainnet"),
    }),
  };
})();

program
  .name("mineral")
  .description("Mineral CLI Miner\nhttps://mineral.supply/")
  .version("1.0.0");

program
  .command("profile")
  .description("View your mining stats")
  .action((_options) =>
    (async () => {
      if (!settings.wallet) {
        return program.error(SETUP_PROMPT);
      }
      const pub = settings.wallet.toSuiAddress();
      console.log(chalk.green("Wallet:"), pub);
      const minerAcct = await getProof(settings.rpc, pub);
      if (minerAcct) {
        console.log(chalk.green("Miner:"), minerAcct);
      }
      const results = await Promise.all([
        (async () => {
          const bal = await settings.rpc.getBalance({
            owner: pub,
            coinType: SUI_TYPE_ARG,
          });
          const val = formatBig(BigInt(bal.totalBalance), SUI_DECIMALS);
          return [`💧 Sui Balance: ${val} SUI`];
        })(),
        (async () => {
          const bal = await settings.rpc.getBalance({
            owner: pub,
            coinType: MINE.$typeName,
          });
          const val = formatBig(BigInt(bal.totalBalance), SUI_DECIMALS);
          return [`⛏️  Mineral Balance: ${val} $MINE`];
        })(),
        (async () => {
          const proof = await getProof(settings.rpc, pub);
          if (!proof) {
            return [];
          }
          const miner = await Miner.fetch(settings.rpc, proof);
          return [
            `💰 Lifetime rewards: ${formatBig(miner.totalRewards, 9)} $MINE`,
            `🏭 Lifetime hashes: ${miner.totalHashes}`,
          ];
        })(),
      ]);
      results.flat().forEach((val) => console.log(val));
    })().catch(console.error)
  );

program
  .command("stats")
  .description("View global Mineral stats")
  .action((_options) =>
    (async () => {
      const config = await Config.fetch(settings.rpc, constants.CONFIG);
      const bus = await fetchBus(settings.rpc);
      console.log(
        "Total distributed rewards:",
        Number(config.totalRewards) / 1_000_000_000,
        "$MINE"
      );
      console.log("Total hashes processed:", Number(config.totalHashes));
      console.log(
        "Current reward rate:",
        Number(bus.rewardRate) / 1_000_000_000,
        "$MINE / hash"
      );
      console.log("Current difficulty:", bus.difficulty);
    })().catch(console.error)
  );

program
  .command("create-wallet")
  .description("Create a new Sui wallet")
  .action(async (_options) => {
    const wallet = new Ed25519Keypair();
    console.log(chalk.green("Wallet created:"), wallet.toSuiAddress());
    console.log(chalk.red("Private key:"), wallet.getSecretKey());
    console.log(chalk.blue("Mineral CLI usage guide:"), USAGE_GUIDE);
  });

program
  .command("mine")
  .description("Start mining ⛏️")
  .action((_options) =>
    (async () => {
      if (!settings.wallet) {
        return program.error(SETUP_PROMPT);
      }
      const bal = await settings.rpc.getBalance({
        owner: settings.wallet.toSuiAddress(),
        coinType: SUI_TYPE_ARG,
      });
      if (Number(bal.totalBalance) < 0.1) {
        console.log(
          chalk.red("Low balance"),
          "in wallet",
          settings.wallet.toSuiAddress()
        );
        console.log("Send some SUI to this wallet to enable mining.");
      }

      if (Date.now() < START_TIME) {
        return program.error("⚠️  Mining has not started yet!");
      }

      console.error(
        chalk.green("Mining with wallet:"),
        settings.wallet.toSuiAddress()
      );
      const minerAccount = await getOrCreateMiner(
        settings.wallet,
        settings.rpc
      );
      const bus = await fetchBus(settings.rpc);

      if (!minerAccount) {
        return program.error("Miner account not created!");
      }

      const handleEvent = (ev: MineEvent) => {
        switch (ev) {
          case "resetting": {
            break;
          }
          case "retrying": {
            break;
          }
          case "submitting": {
            console.log("✅ Valid hash found");
            console.log("📡 Submitting transaction");
            break;
          }
          case "success": {
            console.log("🏅 Mining success!");
            console.log("🔍 Looking for next hash...");
            break;
          }
          case "simulating": {
            break;
          }
          case "checkpoint": {
            break;
          }
        }
      };

      runner(
        settings.rpc,
        bus.difficulty,
        settings.wallet,
        minerAccount,
        handleEvent
      );

      console.log("⛏️  Mining started");
      console.log("🔍 Looking for a valid proof...");
    })().catch(console.error)
  );

program.parse(process.argv);

async function runner(
  client: SuiClient,
  difficulty: number,
  wallet: Ed25519Keypair,
  minerId: string,
  logger?: (_val: MineEvent) => void
) {
  const log = (val: MineEvent) => (logger ? logger(val) : null);
  const tag = wallet.toSuiAddress().slice(0, 8);

  const signerBytes = bcs.Address.serialize(wallet.toSuiAddress()).toBytes();

  let previousHash = new Uint8Array(32);
  let currentHash: Uint8Array | null = null;
  let nonce = BigInt(0);

  while (true) {
    await (async () => {
      if (!currentHash) {
        const miner = await Miner.fetch(client, minerId);
        const fetchedHash = new Uint8Array(miner.currentHash);

        // Check if RPC hash has changed
        if (bufferEq(previousHash, fetchedHash)) {
          return snooze(2000);
        } else {
          currentHash = fetchedHash;
          previousHash = fetchedHash;
        }
      }

      const hash = createHash(currentHash, signerBytes, nonce);
      const hashIsValid = validateHash(hash, difficulty);
      if (hashIsValid) {
        const { bus, status } = await findBus(client);

        switch (status) {
          case BusStatus.MineOk: {
            break;
          }
          case BusStatus.ResetNeeded: {
            if (roll20()) {
              log("resetting");
              await execReset(client, wallet);
            } else {
              await waitUntilReady(client);
            }
            return null;
          }
          case BusStatus.RewardsExhausted: {
            log("waiting");
            await waitUntilReady(client);
            return null;
          }
        }

        const proofData = {
          proof: {
            currentHash: Array.from(currentHash),
            nonce: Number(nonce),
          },
          miner: minerId,
          coinObject: null,
        };

        log("submitting");
        const tx_response = await submitProof(wallet, client, proofData, bus);

        if (!tx_response) {
          return;
        }

        log("success");

        currentHash = null;
        nonce = BigInt(0);
      } else {
        if (nonce % BigInt(1_000_000) == BigInt(0)) {
          log("checkpoint");
          await snooze(0);
        }
        nonce++;
      }
    })().catch((e) => {
      console.error(tag, e);
      return snooze(500);
    });
  }
}

async function findBus(
  client: SuiClient
): Promise<{ bus: Bus; status: BusStatus }> {
  const buses = await fetchBuses(client);

  const bus = buses[0];

  const closeToReset = canBeReset(bus.lastReset);

  if (bus.rewards.value >= bus.rewardRate) {
    return {
      bus,
      status: closeToReset ? BusStatus.ResetNeeded : BusStatus.MineOk,
    };
  } else {
    const bus = buses[0];
    return {
      bus,
      status: closeToReset ? BusStatus.ResetNeeded : BusStatus.RewardsExhausted,
    };
  }
}

function formatBig(n: bigint, decimals: number) {
  return numbro(Number(n) / Math.pow(10, decimals)).format({
    mantissa: 9,
    trimMantissa: true,
  });
}

function roll20(): boolean {
  return Math.floor(Math.random() * 20) === 0;
}

function bufferEq(a: Uint8Array, b: Uint8Array): boolean {
  function bufferToHex(buffer: Uint8Array): string {
    return Array.from(buffer)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
  return bufferToHex(a) === bufferToHex(b);
}

async function execReset(
  client: SuiClient,
  wallet: Ed25519Keypair
): Promise<SuiTransactionBlockResponse | null> {
  // TODO refactor
  //const shouldRetry = await (async () => {
  //if (dryRun.effects.status.status === "failure") {
  //const contractErr = extractError(dryRun.effects.status);
  //const errMsg = dryRun.effects.status.error || "missing";

  //if (errMsg.includes(constants.ENeedsReset.toString())) {
  //progressHandler("resetting");
  //await execReset(client, wallet);
  //return true;
  //} else if (errMsg.includes(constants.ERewardsExhausted.toString())) {
  //return true;
  //} else if (contractErr) {
  //throw Error(contractErr);
  //} else {
  //throw Error("Unknown error");
  //}
  //} else {
  //return false;
  //}
  //})();

  //if (shouldRetry) {
  //progressHandler("retrying");
  //return null;
  //}

  const bus = await fetchBus(client);

  const threshold = Number(bus.lastReset) + constants.EPOCH_LENGTH;

  const now = Date.now();
  if (now >= threshold) {
    const txb = new TransactionBlock();
    epochReset(txb, {
      config: constants.CONFIG,
      buses: constants.BUSES.map((x) =>
        txb.sharedObjectRef({
          objectId: x,
          mutable: true,
          initialSharedVersion: 0,
        })
      ),
      clock: SUI_CLOCK_OBJECT_ID,
    });

    const res = await launch(txb, client, wallet, 1_000_000);
    if (!res.effects) {
      throw Error("Tx effects missing");
    }
    handleMineralError(res.effects);

    return res;
  }

  return null;
}

async function waitUntilReady(client: SuiClient) {
  while (true) {
    const bus = await fetchBus(client);

    if (canBeReset(bus.lastReset)) {
      await snooze(2000);
    } else {
      break;
    }
  }
}

function canBeReset(ts: bigint) {
  const threshold = Number(ts) + constants.EPOCH_LENGTH;

  return Date.now() >= threshold - 2_000;
}
