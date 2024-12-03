import { Transaction } from "@mysten/sui/transactions";
import { SUI_TYPE_ARG } from "@mysten/sui/utils";
import { SuiClient } from "@mysten/sui/client";

import { SharedObj } from "./lib";
import { BoardPort } from "./ports";
import { phantom, PhantomReified } from "./codegen/_framework/reified";
import {
  topupPrizePool,
  claimPrize,
  choose,
  register,
  verify,
} from "./sweepgen/minesweep/board/functions";
import { Board } from "./sweepgen/minesweep/board/structs";

const REGISTRATION_FEE = 0;

export const types: [string, string] = [SUI_TYPE_ARG, SUI_TYPE_ARG];
export const phantomTypes: [PhantomReified<string>, PhantomReified<string>] = [
  phantom(types[0]),
  phantom(types[1]),
];

export function joinGame(
  txb: Transaction,
  boardObj: SharedObj,
  _stake: string
) {
  const coin = txb.splitCoins(txb.gas, [REGISTRATION_FEE]);
  register(txb, types, {
    board: txb.sharedObjectRef(boardObj),
    fee: coin,
    //stake,
    stake: txb.gas,
  });
}

export function topup(txb: Transaction, boardObj: SharedObj) {
  const coin = txb.splitCoins(txb.gas, [10_000_000]);
  topupPrizePool(txb, types, {
    board: txb.sharedObjectRef(boardObj),
    prize: coin,
  });
}

export function selectSquare(
  txb: Transaction,
  x: number,
  y: number,
  boardObj: SharedObj,
  _stake: string
) {
  choose(txb, types, {
    board: txb.sharedObjectRef(boardObj),
    //stake,
    stake: txb.gas,
    x,
    y,
  });
}

export function claim(txb: Transaction, boardObj: SharedObj) {
  return claimPrize(txb, types, txb.sharedObjectRef(boardObj));
}

export function verifyChoice(txb: Transaction, boardObj: SharedObj) {
  verify(txb, types, txb.sharedObjectRef(boardObj));
}

export async function fetchBoard(provider: SuiClient, board: string) {
  return Board.fetch(provider, phantomTypes, board);
}

export function parseBoard(bts: number[]): Board<string, string> {
  return Board.fromBcs(phantomTypes, new Uint8Array(bts));
}

export function buildBoard(board: Board<string, string>): BoardPort {
  const s = board.status.$data;
  const prev = board.previousRound;
  const prevGame = board.previousGame;

  const startingPlayers = (() => {
    switch (s.$kind) {
      case "standby": {
        return prevGame ? prevGame.startingPlayers : 0;
      }
      case "playing": {
        return s.playing.startingPlayers;
      }
      case "waitingToStart": {
        return 0;
      }
    }
  })();

  const status = (() => {
    switch (s.$kind) {
      case "standby": {
        return { kind: "ended", data: null };
      }
      case "playing": {
        return {
          kind: "playing",
          data: {
            round: s.playing.round,
            guessCutoff: Number(s.playing.selectionCutoffTs),
            choices: Number(s.playing.selectionCount),
          },
        };
      }
      case "waitingToStart": {
        return {
          kind: "waiting",
          data: {
            registered: s.waitingToStart.registeredPlayers,
            startTime: Number(s.waitingToStart.startTimeTs),
          },
        };
      }
    }
  })();
  return {
    game: board.currentGame,
    startingPlayers,
    counts: board.playerSelections.contents.map((count) => [
      [count.key.x, count.key.y],
      count.value,
    ]),
    previousGame: prevGame
      ? {
          winner: prevGame.winner,
          round: prevGame.round,
          ended: Number(prevGame.endedTs),
        }
      : null,
    previousRound: prev
      ? {
          counts: prev.playerSelections.contents.map((count) => [
            [count.key.x, count.key.y],
            count.value,
          ]),
          mines: prev.mines.contents,
          safePlayers: prev.survivors,
          eliminated: prev.eliminated,
          status: prev.status.$data.$kind,
        }
      : null,
    prizePool: Number(board.prizePool.value),
    status,
  };
}
