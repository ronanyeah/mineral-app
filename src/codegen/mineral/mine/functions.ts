import {PUBLISHED_AT} from "..";
import {obj, pure, vector} from "../../_framework/util";
import {Bus} from "./structs";
import {Transaction, TransactionArgument, TransactionObjectInput} from "@mysten/sui/transactions";

export function treasury( tx: Transaction, config: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::mine::treasury`, arguments: [ obj(tx, config) ], }) }

export function totalHashes( tx: Transaction, config: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::mine::total_hashes`, arguments: [ obj(tx, config) ], }) }

export function totalRewards( tx: Transaction, config: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::mine::total_rewards`, arguments: [ obj(tx, config) ], }) }

export interface MineArgs { nonce: bigint | TransactionArgument; bus: TransactionObjectInput; miner: TransactionObjectInput; clock: TransactionObjectInput }

export function mine( tx: Transaction, args: MineArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::mine::mine`, arguments: [ pure(tx, args.nonce, `u64`), obj(tx, args.bus), obj(tx, args.miner), obj(tx, args.clock) ], }) }

export function calculateDifficulty( tx: Transaction, totalHashes: bigint | TransactionArgument ) { return tx.moveCall({ target: `${PUBLISHED_AT}::mine::calculate_difficulty`, arguments: [ pure(tx, totalHashes, `u64`) ], }) }

export interface CalculateNewRewardRateArgs { currentRate: bigint | TransactionArgument; epochRewards: bigint | TransactionArgument; maxReward: bigint | TransactionArgument }

export function calculateNewRewardRate( tx: Transaction, args: CalculateNewRewardRateArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::mine::calculate_new_reward_rate`, arguments: [ pure(tx, args.currentRate, `u64`), pure(tx, args.epochRewards, `u64`), pure(tx, args.maxReward, `u64`) ], }) }

export function difficulty( tx: Transaction, bus: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::mine::difficulty`, arguments: [ obj(tx, bus) ], }) }

export interface EpochResetArgs { config: TransactionObjectInput; buses: Array<TransactionObjectInput> | TransactionArgument; clock: TransactionObjectInput }

export function epochReset( tx: Transaction, args: EpochResetArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::mine::epoch_reset`, arguments: [ obj(tx, args.config), vector(tx, `${Bus.$typeName}`, args.buses), obj(tx, args.clock) ], }) }

export interface GenerateProofArgs { currentHash: Array<number | TransactionArgument> | TransactionArgument; sender: string | TransactionArgument; nonce: bigint | TransactionArgument }

export function generateProof( tx: Transaction, args: GenerateProofArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::mine::generate_proof`, arguments: [ pure(tx, args.currentHash, `vector<u8>`), pure(tx, args.sender, `address`), pure(tx, args.nonce, `u64`) ], }) }

export function init( tx: Transaction, witness: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::mine::init`, arguments: [ obj(tx, witness) ], }) }

export function live( tx: Transaction, bus: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::mine::live`, arguments: [ obj(tx, bus) ], }) }

export function rewardRate( tx: Transaction, bus: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::mine::reward_rate`, arguments: [ obj(tx, bus) ], }) }

export function rewards( tx: Transaction, bus: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::mine::rewards`, arguments: [ obj(tx, bus) ], }) }

export interface ValidateProofArgs { proof: Array<number | TransactionArgument> | TransactionArgument; difficulty: number | TransactionArgument }

export function validateProof( tx: Transaction, args: ValidateProofArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::mine::validate_proof`, arguments: [ pure(tx, args.proof, `vector<u8>`), pure(tx, args.difficulty, `u8`) ], }) }
