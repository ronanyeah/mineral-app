/* This file was generated by github.com/ronanyeah/elm-port-gen */

interface ElmApp {
  ports: Ports;
}

interface Ports {
  log: PortOut<string>;
  copy: PortOut<string>;
  registerMiner: PortOut<null>;
  importWallet: PortOut<string | null>;
  submitProof: PortOut<ProofData>;
  mine: PortOut<string>;
  refreshTokens: PortOut<null>;
  stopMining: PortOut<null>;
  clearWallet: PortOut<null>;
  combineCoins: PortOut<null>;
  joinGame: PortOut<{
    stake: string;
  }>;
  selectSquare: PortOut<{
    square: Choice;
    verify: boolean;
    stake: string;
  }>;
  connectWallet: PortOut<null>;
  boardBytes: PortOut<number[]>;
  claimPrize: PortOut<null>;
  disconnect: PortOut<null>;
  alert: PortOut<string>;
  minerCreatedCb: PortIn<Miner>;
  statusCb: PortIn<number>;
  miningError: PortIn<string>;
  proofSubmitError: PortIn<string>;
  balancesCb: PortIn<Balances | null>;
  walletCb: PortIn<Wallet>;
  proofCb: PortIn<Proof>;
  hashCountCb: PortIn<number>;
  retrySubmitProof: PortIn<ProofData>;
  connectCb: PortIn<string | null>;
  boardCb: PortIn<BoardPort>;
  signedCb: PortIn<PortResult<string, SignedTx>>;
}

interface PortOut<T> {
  subscribe: (_: (_: T) => void) => void;
}

interface PortIn<T> {
  send: (_: T) => void;
}

type PortResult<E, T> =
    | { err: E; data: null }
    | { err: null; data: T };

interface Flags {
  wallet: Keypair | null;
  time: number;
  rpc: [string, string[]];
  spectatorId: string;
  screen: Screen;
}

interface Screen {
  width: number;
  height: number;
}

interface Wallet {
  address: string;
  privateKey: string;
  balances: Balances | null;
  miningAccount: Miner | null;
}

interface Balances {
  mineral: number;
  sui: number;
  mineralObjects: number;
  coinObject: string | null;
}

interface Miner {
  address: string;
}

interface Keypair {
  pub: string;
  pvt: string;
}

interface Proof {
  currentHash: number[];
  nonce: number;
}

interface Stats {
  totalHashes: number;
  totalRewards: number;
  rewardRate: number;
  daysMining: number;
}

interface ProofData {
  proof: Proof;
  miner: string;
  coinObject: string | null;
}

interface Choice {
  x: number;
  y: number;
}

interface GameResult {
  winner: string;
  round: number;
  ended: number;
}

interface SignedTx {
  bytes: string;
  signature: string;
}

interface BoardPort {
  status: {
    kind: string;
    data: any;
  };
  game: number;
  startingPlayers: number;
  counts: [[number, number], number][];
  previousRound: {
    safePlayers: number;
    eliminated: number;
    mines: Choice[];
    counts: [[number, number], number][];
    status: string;
  } | null;
  previousGame: GameResult | null;
  prizePool: number;
}

interface ChoiceCount {
  count: number;
  choice: Choice;
}

function portOk<E, T>(data: T): PortResult<E, T> {
  return { data, err: null };
}

function portErr<E, T>(err: E): PortResult<E, T> {
  return { data: null, err };
}

export { ElmApp, PortResult, portOk, portErr, Flags, Screen, Wallet, Balances, Miner, Keypair, Proof, Stats, ProofData, Choice, GameResult, SignedTx, BoardPort, ChoiceCount };