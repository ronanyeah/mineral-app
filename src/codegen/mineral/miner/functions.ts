import {PUBLISHED_AT} from "..";
import {obj, pure} from "../../_framework/util";
import {Transaction, TransactionArgument, TransactionObjectInput} from "@mysten/sui/transactions";

export function new_( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::miner::new`, arguments: [ ], }) }

export function destroy( tx: Transaction, self: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::miner::destroy`, arguments: [ obj(tx, self) ], }) }

export function currentHash( tx: Transaction, self: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::miner::current_hash`, arguments: [ obj(tx, self) ], }) }

export function currentHashMut( tx: Transaction, self: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::miner::current_hash_mut`, arguments: [ obj(tx, self) ], }) }

export function recordHash( tx: Transaction, self: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::miner::record_hash`, arguments: [ obj(tx, self) ], }) }

export interface RecordRewardsArgs { self: TransactionObjectInput; amount: bigint | TransactionArgument }

export function recordRewards( tx: Transaction, args: RecordRewardsArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::miner::record_rewards`, arguments: [ obj(tx, args.self), pure(tx, args.amount, `u64`) ], }) }

export function register( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::miner::register`, arguments: [ ], }) }

export function totalHashes( tx: Transaction, self: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::miner::total_hashes`, arguments: [ obj(tx, self) ], }) }

export function totalRewards( tx: Transaction, self: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::miner::total_rewards`, arguments: [ obj(tx, self) ], }) }
