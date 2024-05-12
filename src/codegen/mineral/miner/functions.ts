import {PUBLISHED_AT} from "..";
import {ObjectArg, obj, pure} from "../../_framework/util";
import {TransactionArgument, TransactionBlock} from "@mysten/sui.js/transactions";

export function new_( txb: TransactionBlock, ) { return txb.moveCall({ target: `${PUBLISHED_AT}::miner::new`, arguments: [ ], }) }

export function currentHash( txb: TransactionBlock, self: ObjectArg ) { return txb.moveCall({ target: `${PUBLISHED_AT}::miner::current_hash`, arguments: [ obj(txb, self) ], }) }

export function currentHashMut( txb: TransactionBlock, self: ObjectArg ) { return txb.moveCall({ target: `${PUBLISHED_AT}::miner::current_hash_mut`, arguments: [ obj(txb, self) ], }) }

export function destroy( txb: TransactionBlock, self: ObjectArg ) { return txb.moveCall({ target: `${PUBLISHED_AT}::miner::destroy`, arguments: [ obj(txb, self) ], }) }

export function recordHash( txb: TransactionBlock, self: ObjectArg ) { return txb.moveCall({ target: `${PUBLISHED_AT}::miner::record_hash`, arguments: [ obj(txb, self) ], }) }

export interface RecordRewardsArgs { self: ObjectArg; amount: bigint | TransactionArgument }

export function recordRewards( txb: TransactionBlock, args: RecordRewardsArgs ) { return txb.moveCall({ target: `${PUBLISHED_AT}::miner::record_rewards`, arguments: [ obj(txb, args.self), pure(txb, args.amount, `u64`) ], }) }

export function register( txb: TransactionBlock, ) { return txb.moveCall({ target: `${PUBLISHED_AT}::miner::register`, arguments: [ ], }) }

export function totalHashes( txb: TransactionBlock, self: ObjectArg ) { return txb.moveCall({ target: `${PUBLISHED_AT}::miner::total_hashes`, arguments: [ obj(txb, self) ], }) }

export function totalRewards( txb: TransactionBlock, self: ObjectArg ) { return txb.moveCall({ target: `${PUBLISHED_AT}::miner::total_rewards`, arguments: [ obj(txb, self) ], }) }
