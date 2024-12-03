import {PUBLISHED_AT} from "..";
import {obj, pure} from "../../_framework/util";
import {Transaction, TransactionArgument, TransactionObjectInput} from "@mysten/sui/transactions";

export interface AbsorbPrizeArgs { board: TransactionObjectInput; clock: TransactionObjectInput }

export function absorbPrize( tx: Transaction, typeArgs: [string, string], args: AbsorbPrizeArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::board::absorb_prize`, typeArguments: typeArgs, arguments: [ obj(tx, args.board), obj(tx, args.clock) ], }) }

export interface AdvanceNextRoundArgs { r: TransactionObjectInput; clock: TransactionObjectInput; board: TransactionObjectInput }

export function advanceNextRound( tx: Transaction, typeArgs: [string, string], args: AdvanceNextRoundArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::board::advance_next_round`, typeArguments: typeArgs, arguments: [ obj(tx, args.r), obj(tx, args.clock), obj(tx, args.board) ], }) }

export interface CanAdvanceArgs { status: TransactionObjectInput; now: bigint | TransactionArgument; currentPlayers: number | TransactionArgument }

export function canAdvance( tx: Transaction, args: CanAdvanceArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::board::can_advance`, arguments: [ obj(tx, args.status), pure(tx, args.now, `u64`), pure(tx, args.currentPlayers, `u16`) ], }) }

export interface ChooseArgs { stake: TransactionObjectInput; board: TransactionObjectInput; x: number | TransactionArgument; y: number | TransactionArgument }

export function choose( tx: Transaction, typeArgs: [string, string], args: ChooseArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::board::choose`, typeArguments: typeArgs, arguments: [ obj(tx, args.stake), obj(tx, args.board), pure(tx, args.x, `u16`), pure(tx, args.y, `u16`) ], }) }

export function claimPrize( tx: Transaction, typeArgs: [string, string], board: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::board::claim_prize`, typeArguments: typeArgs, arguments: [ obj(tx, board) ], }) }

export interface ClearPlayerArgs { cap: TransactionObjectInput; player: string | TransactionArgument; board: TransactionObjectInput }

export function clearPlayer( tx: Transaction, typeArgs: [string, string], args: ClearPlayerArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::board::clear_player`, typeArguments: typeArgs, arguments: [ obj(tx, args.cap), pure(tx, args.player, `address`), obj(tx, args.board) ], }) }

export interface CreateBoardArgs { stakeRequirement: bigint | TransactionArgument; entryFee: bigint | TransactionArgument }

export function createBoard( tx: Transaction, typeArgs: [string, string], args: CreateBoardArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::board::create_board`, typeArguments: typeArgs, arguments: [ pure(tx, args.stakeRequirement, `u64`), pure(tx, args.entryFee, `u64`) ], }) }

export function decrementRegistrations( tx: Transaction, status: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::board::decrement_registrations`, arguments: [ obj(tx, status) ], }) }

export interface DetectHitArgs { selection: TransactionObjectInput; mines: Array<number | TransactionArgument> | TransactionArgument; mineCutoff: number | TransactionArgument }

export function detectHit( tx: Transaction, args: DetectHitArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::board::detect_hit`, arguments: [ obj(tx, args.selection), pure(tx, args.mines, `vector<u8>`), pure(tx, args.mineCutoff, `u8`) ], }) }

export interface ForceResetArgs { cap: TransactionObjectInput; currentGame: number | TransactionArgument; board: TransactionObjectInput }

export function forceReset( tx: Transaction, typeArgs: [string, string], args: ForceResetArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::board::force_reset`, typeArguments: typeArgs, arguments: [ obj(tx, args.cap), pure(tx, args.currentGame, `u32`), obj(tx, args.board) ], }) }

export function getCurrentParticipants( tx: Transaction, status: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::board::get_current_participants`, arguments: [ obj(tx, status) ], }) }

export function getCurrentPlayers( tx: Transaction, typeArgs: [string, string], self: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::board::get_current_players`, typeArguments: typeArgs, arguments: [ obj(tx, self) ], }) }

export function getPlayingFields( tx: Transaction, status: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::board::get_playing_fields`, arguments: [ obj(tx, status) ], }) }

export function getRound( tx: Transaction, status: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::board::get_round`, arguments: [ obj(tx, status) ], }) }

export function incrementRegistrations( tx: Transaction, status: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::board::increment_registrations`, arguments: [ obj(tx, status) ], }) }

export interface IncrementRoundArgs { status: TransactionObjectInput; now: bigint | TransactionArgument }

export function incrementRound( tx: Transaction, args: IncrementRoundArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::board::increment_round`, arguments: [ obj(tx, args.status), pure(tx, args.now, `u64`) ], }) }

export function incrementSelectionCount( tx: Transaction, status: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::board::increment_selection_count`, arguments: [ obj(tx, status) ], }) }

export function init( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::board::init`, arguments: [ ], }) }

export interface InitializeGameArgs { board: TransactionObjectInput; clock: TransactionObjectInput; startTimeTs: bigint | TransactionArgument }

export function initializeGame( tx: Transaction, typeArgs: [string, string], args: InitializeGameArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::board::initialize_game`, typeArguments: typeArgs, arguments: [ obj(tx, args.board), obj(tx, args.clock), pure(tx, args.startTimeTs, `u64`) ], }) }

export function isFinal( tx: Transaction, status: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::board::is_final`, arguments: [ obj(tx, status) ], }) }

export interface ReadPlayerArgs { player: string | TransactionArgument; board: TransactionObjectInput }

export function readPlayer( tx: Transaction, typeArgs: [string, string], args: ReadPlayerArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::board::read_player`, typeArguments: typeArgs, arguments: [ pure(tx, args.player, `address`), obj(tx, args.board) ], }) }

export interface RegisterArgs { stake: TransactionObjectInput; fee: TransactionObjectInput; board: TransactionObjectInput }

export function register( tx: Transaction, typeArgs: [string, string], args: RegisterArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::board::register`, typeArguments: typeArgs, arguments: [ obj(tx, args.stake), obj(tx, args.fee), obj(tx, args.board) ], }) }

export interface StartGameArgs { board: TransactionObjectInput; clock: TransactionObjectInput }

export function startGame( tx: Transaction, typeArgs: [string, string], args: StartGameArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::board::start_game`, typeArguments: typeArgs, arguments: [ obj(tx, args.board), obj(tx, args.clock) ], }) }

export interface TopupPrizePoolArgs { board: TransactionObjectInput; prize: TransactionObjectInput }

export function topupPrizePool( tx: Transaction, typeArgs: [string, string], args: TopupPrizePoolArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::board::topup_prize_pool`, typeArguments: typeArgs, arguments: [ obj(tx, args.board), obj(tx, args.prize) ], }) }

export function unregister( tx: Transaction, typeArgs: [string, string], board: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::board::unregister`, typeArguments: typeArgs, arguments: [ obj(tx, board) ], }) }

export interface ValidateStartArgs { status: TransactionObjectInput; now: bigint | TransactionArgument }

export function validateStart( tx: Transaction, args: ValidateStartArgs ) { return tx.moveCall({ target: `${PUBLISHED_AT}::board::validate_start`, arguments: [ obj(tx, args.status), pure(tx, args.now, `u64`) ], }) }

export function verify( tx: Transaction, typeArgs: [string, string], board: TransactionObjectInput ) { return tx.moveCall({ target: `${PUBLISHED_AT}::board::verify`, typeArguments: typeArgs, arguments: [ obj(tx, board) ], }) }
