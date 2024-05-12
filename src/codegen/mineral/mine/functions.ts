import {PUBLISHED_AT} from "..";
import {ObjectArg, obj, pure, vector} from "../../_framework/util";
import {TransactionArgument, TransactionBlock} from "@mysten/sui.js/transactions";

export function treasury( txb: TransactionBlock, config: ObjectArg ) { return txb.moveCall({ target: `${PUBLISHED_AT}::mine::treasury`, arguments: [ obj(txb, config) ], }) }

export function totalHashes( txb: TransactionBlock, config: ObjectArg ) { return txb.moveCall({ target: `${PUBLISHED_AT}::mine::total_hashes`, arguments: [ obj(txb, config) ], }) }

export function totalRewards( txb: TransactionBlock, config: ObjectArg ) { return txb.moveCall({ target: `${PUBLISHED_AT}::mine::total_rewards`, arguments: [ obj(txb, config) ], }) }

export interface MineArgs { nonce: bigint | TransactionArgument; bus: ObjectArg; miner: ObjectArg; clock: ObjectArg }

export function mine( txb: TransactionBlock, args: MineArgs ) { return txb.moveCall({ target: `${PUBLISHED_AT}::mine::mine`, arguments: [ pure(txb, args.nonce, `u64`), obj(txb, args.bus), obj(txb, args.miner), obj(txb, args.clock) ], }) }

export function calculateDifficulty( txb: TransactionBlock, totalHashes: bigint | TransactionArgument ) { return txb.moveCall({ target: `${PUBLISHED_AT}::mine::calculate_difficulty`, arguments: [ pure(txb, totalHashes, `u64`) ], }) }

export interface CalculateNewRewardRateArgs { currentRate: bigint | TransactionArgument; epochRewards: bigint | TransactionArgument; maxReward: bigint | TransactionArgument }

export function calculateNewRewardRate( txb: TransactionBlock, args: CalculateNewRewardRateArgs ) { return txb.moveCall({ target: `${PUBLISHED_AT}::mine::calculate_new_reward_rate`, arguments: [ pure(txb, args.currentRate, `u64`), pure(txb, args.epochRewards, `u64`), pure(txb, args.maxReward, `u64`) ], }) }

export function difficulty( txb: TransactionBlock, bus: ObjectArg ) { return txb.moveCall({ target: `${PUBLISHED_AT}::mine::difficulty`, arguments: [ obj(txb, bus) ], }) }

export interface EpochResetArgs { config: ObjectArg; buses: Array<ObjectArg> | TransactionArgument; clock: ObjectArg }

export function epochReset( txb: TransactionBlock, args: EpochResetArgs ) { return txb.moveCall({ target: `${PUBLISHED_AT}::mine::epoch_reset`, arguments: [ obj(txb, args.config), vector(txb, `0x9cde6fd22c9518820644dd1350ac1595bb23751033d247465ff3c7572d9a7049::mine::Bus`, args.buses), obj(txb, args.clock) ], }) }

export interface GenerateProofArgs { currentHash: Array<number | TransactionArgument> | TransactionArgument; sender: string | TransactionArgument; nonce: bigint | TransactionArgument }

export function generateProof( txb: TransactionBlock, args: GenerateProofArgs ) { return txb.moveCall({ target: `${PUBLISHED_AT}::mine::generate_proof`, arguments: [ pure(txb, args.currentHash, `vector<u8>`), pure(txb, args.sender, `address`), pure(txb, args.nonce, `u64`) ], }) }

export function init( txb: TransactionBlock, witness: ObjectArg ) { return txb.moveCall({ target: `${PUBLISHED_AT}::mine::init`, arguments: [ obj(txb, witness) ], }) }

export function live( txb: TransactionBlock, bus: ObjectArg ) { return txb.moveCall({ target: `${PUBLISHED_AT}::mine::live`, arguments: [ obj(txb, bus) ], }) }

export function rewardRate( txb: TransactionBlock, bus: ObjectArg ) { return txb.moveCall({ target: `${PUBLISHED_AT}::mine::reward_rate`, arguments: [ obj(txb, bus) ], }) }

export function rewards( txb: TransactionBlock, bus: ObjectArg ) { return txb.moveCall({ target: `${PUBLISHED_AT}::mine::rewards`, arguments: [ obj(txb, bus) ], }) }

export interface ValidateProofArgs { proof: Array<number | TransactionArgument> | TransactionArgument; difficulty: number | TransactionArgument }

export function validateProof( txb: TransactionBlock, args: ValidateProofArgs ) { return txb.moveCall({ target: `${PUBLISHED_AT}::mine::validate_proof`, arguments: [ pure(txb, args.proof, `vector<u8>`), pure(txb, args.difficulty, `u8`) ], }) }
