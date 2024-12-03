import * as reified from "../../_framework/reified";
import {Option} from "../../_dependencies/source/0x1/option/structs";
import {Balance} from "../../_dependencies/source/0x2/balance/structs";
import {ID, UID} from "../../_dependencies/source/0x2/object/structs";
import {Table} from "../../_dependencies/source/0x2/table/structs";
import {VecMap} from "../../_dependencies/source/0x2/vec-map/structs";
import {VecSet} from "../../_dependencies/source/0x2/vec-set/structs";
import {EnumClass, PhantomReified, PhantomToTypeStr, PhantomTypeArgument, Reified, StructClass, ToField, ToPhantomTypeArgument, ToTypeStr, assertFieldsWithTypesArgsMatch, assertReifiedTypeArgsMatch, decodeFromFields, decodeFromFieldsWithTypes, decodeFromJSONField, extractType, fieldToJSON, phantom, ToTypeStr as ToPhantom} from "../../_framework/reified";
import {FieldsWithTypes, composeSuiType, compressSuiType, parseTypeName} from "../../_framework/util";
import {PKG_V1} from "../index";
import {EnumOutputShapeWithKeys} from "@mysten/bcs";
import {bcs} from "@mysten/sui/bcs";
import {SuiClient, SuiObjectData, SuiParsedData} from "@mysten/sui/client";
import {fromB64, fromHEX, toHEX} from "@mysten/sui/utils";

/* ============================== Board =============================== */

export function isBoard(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::board::Board` + '<'); }

export interface BoardFields<STAKE extends PhantomTypeArgument, PRIZE extends PhantomTypeArgument> { id: ToField<UID>; admin: ToField<"address">; adminFees: ToField<Balance<PRIZE>>; rake: ToField<"u8">; stakeRequirement: ToField<"u64">; entryFee: ToField<"u64">; currentGame: ToField<"u32">; mineDensity: ToField<"u8">; status: ToField<GameStatus>; previousGame: ToField<Option<GameResult>>; previousRound: ToField<Option<RoundResult>>; playerSelections: ToField<VecMap<Coord, "u16">>; prizePool: ToField<Balance<PRIZE>>; players: ToField<Table<"address", ToPhantom<PlayerProgress>>> }

export type BoardReified<STAKE extends PhantomTypeArgument, PRIZE extends PhantomTypeArgument> = Reified< Board<STAKE, PRIZE>, BoardFields<STAKE, PRIZE> >;

export class Board<STAKE extends PhantomTypeArgument, PRIZE extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::board::Board`; static readonly $numTypeParams = 2; static readonly $isPhantom = [true,true,] as const;

 readonly $typeName = Board.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::board::Board<${PhantomToTypeStr<STAKE>}, ${PhantomToTypeStr<PRIZE>}>`; readonly $typeArgs: [PhantomToTypeStr<STAKE>, PhantomToTypeStr<PRIZE>]; readonly $isPhantom = Board.$isPhantom;

 readonly id: ToField<UID>; readonly admin: ToField<"address">; readonly adminFees: ToField<Balance<PRIZE>>; readonly rake: ToField<"u8">; readonly stakeRequirement: ToField<"u64">; readonly entryFee: ToField<"u64">; readonly currentGame: ToField<"u32">; readonly mineDensity: ToField<"u8">; readonly status: ToField<GameStatus>; readonly previousGame: ToField<Option<GameResult>>; readonly previousRound: ToField<Option<RoundResult>>; readonly playerSelections: ToField<VecMap<Coord, "u16">>; readonly prizePool: ToField<Balance<PRIZE>>; readonly players: ToField<Table<"address", ToPhantom<PlayerProgress>>>

 private constructor(typeArgs: [PhantomToTypeStr<STAKE>, PhantomToTypeStr<PRIZE>], fields: BoardFields<STAKE, PRIZE>, ) { this.$fullTypeName = composeSuiType( Board.$typeName, ...typeArgs ) as `${typeof PKG_V1}::board::Board<${PhantomToTypeStr<STAKE>}, ${PhantomToTypeStr<PRIZE>}>`; this.$typeArgs = typeArgs;

 this.id = fields.id;; this.admin = fields.admin;; this.adminFees = fields.adminFees;; this.rake = fields.rake;; this.stakeRequirement = fields.stakeRequirement;; this.entryFee = fields.entryFee;; this.currentGame = fields.currentGame;; this.mineDensity = fields.mineDensity;; this.status = fields.status;; this.previousGame = fields.previousGame;; this.previousRound = fields.previousRound;; this.playerSelections = fields.playerSelections;; this.prizePool = fields.prizePool;; this.players = fields.players; }

 static reified<STAKE extends PhantomReified<PhantomTypeArgument>, PRIZE extends PhantomReified<PhantomTypeArgument>>( STAKE: STAKE, PRIZE: PRIZE ): BoardReified<ToPhantomTypeArgument<STAKE>, ToPhantomTypeArgument<PRIZE>> { return { typeName: Board.$typeName, fullTypeName: composeSuiType( Board.$typeName, ...[extractType(STAKE), extractType(PRIZE)] ) as `${typeof PKG_V1}::board::Board<${PhantomToTypeStr<ToPhantomTypeArgument<STAKE>>}, ${PhantomToTypeStr<ToPhantomTypeArgument<PRIZE>>}>`, typeArgs: [ extractType(STAKE), extractType(PRIZE) ] as [PhantomToTypeStr<ToPhantomTypeArgument<STAKE>>, PhantomToTypeStr<ToPhantomTypeArgument<PRIZE>>], isPhantom: Board.$isPhantom, reifiedTypeArgs: [STAKE, PRIZE], fromFields: (fields: Record<string, any>) => Board.fromFields( [STAKE, PRIZE], fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => Board.fromFieldsWithTypes( [STAKE, PRIZE], item, ), fromBcs: (data: Uint8Array) => Board.fromBcs( [STAKE, PRIZE], data, ), bcs: Board.bcs, fromJSONField: (field: any) => Board.fromJSONField( [STAKE, PRIZE], field, ), fromJSON: (json: Record<string, any>) => Board.fromJSON( [STAKE, PRIZE], json, ), fromSuiParsedData: (content: SuiParsedData) => Board.fromSuiParsedData( [STAKE, PRIZE], content, ), fromSuiObjectData: (content: SuiObjectData) => Board.fromSuiObjectData( [STAKE, PRIZE], content, ), fetch: async (client: SuiClient, id: string) => Board.fetch( client, [STAKE, PRIZE], id, ), new: ( fields: BoardFields<ToPhantomTypeArgument<STAKE>, ToPhantomTypeArgument<PRIZE>>, ) => { return new Board( [extractType(STAKE), extractType(PRIZE)], fields ) }, kind: "StructClassReified", } }

 static get r() { return Board.reified }

 static phantom<STAKE extends PhantomReified<PhantomTypeArgument>, PRIZE extends PhantomReified<PhantomTypeArgument>>( STAKE: STAKE, PRIZE: PRIZE ): PhantomReified<ToTypeStr<Board<ToPhantomTypeArgument<STAKE>, ToPhantomTypeArgument<PRIZE>>>> { return phantom(Board.reified( STAKE, PRIZE )); } static get p() { return Board.phantom }

 static get bcs() { return bcs.struct("Board", {

 id: UID.bcs, admin: bcs.bytes(32).transform({ input: (val: string) => fromHEX(val), output: (val: Uint8Array) => toHEX(val), }), adminFees: Balance.bcs, rake: bcs.u8(), stakeRequirement: bcs.u64(), entryFee: bcs.u64(), currentGame: bcs.u32(), mineDensity: bcs.u8(), status: GameStatus.bcs, previousGame: Option.bcs(GameResult.bcs), previousRound: Option.bcs(RoundResult.bcs), playerSelections: VecMap.bcs(Coord.bcs, bcs.u16()), prizePool: Balance.bcs, players: Table.bcs

}) };

 static fromFields<STAKE extends PhantomReified<PhantomTypeArgument>, PRIZE extends PhantomReified<PhantomTypeArgument>>( typeArgs: [STAKE, PRIZE], fields: Record<string, any> ): Board<ToPhantomTypeArgument<STAKE>, ToPhantomTypeArgument<PRIZE>> { return Board.reified( typeArgs[0], typeArgs[1], ).new( { id: decodeFromFields(UID.reified(), fields.id), admin: decodeFromFields("address", fields.admin), adminFees: decodeFromFields(Balance.reified(typeArgs[1]), fields.adminFees), rake: decodeFromFields("u8", fields.rake), stakeRequirement: decodeFromFields("u64", fields.stakeRequirement), entryFee: decodeFromFields("u64", fields.entryFee), currentGame: decodeFromFields("u32", fields.currentGame), mineDensity: decodeFromFields("u8", fields.mineDensity), status: decodeFromFields(GameStatus.reified(), fields.status), previousGame: decodeFromFields(Option.reified(GameResult.reified()), fields.previousGame), previousRound: decodeFromFields(Option.reified(RoundResult.reified()), fields.previousRound), playerSelections: decodeFromFields(VecMap.reified(Coord.reified(), "u16"), fields.playerSelections), prizePool: decodeFromFields(Balance.reified(typeArgs[1]), fields.prizePool), players: decodeFromFields(Table.reified(reified.phantom("address"), reified.phantom(PlayerProgress.reified())), fields.players) } ) }

 static fromFieldsWithTypes<STAKE extends PhantomReified<PhantomTypeArgument>, PRIZE extends PhantomReified<PhantomTypeArgument>>( typeArgs: [STAKE, PRIZE], item: FieldsWithTypes ): Board<ToPhantomTypeArgument<STAKE>, ToPhantomTypeArgument<PRIZE>> { if (!isBoard(item.type)) { throw new Error("not a Board type");

 } assertFieldsWithTypesArgsMatch(item, typeArgs);

 return Board.reified( typeArgs[0], typeArgs[1], ).new( { id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id), admin: decodeFromFieldsWithTypes("address", item.fields.admin), adminFees: decodeFromFieldsWithTypes(Balance.reified(typeArgs[1]), item.fields.adminFees), rake: decodeFromFieldsWithTypes("u8", item.fields.rake), stakeRequirement: decodeFromFieldsWithTypes("u64", item.fields.stakeRequirement), entryFee: decodeFromFieldsWithTypes("u64", item.fields.entryFee), currentGame: decodeFromFieldsWithTypes("u32", item.fields.currentGame), mineDensity: decodeFromFieldsWithTypes("u8", item.fields.mineDensity), status: decodeFromFieldsWithTypes(GameStatus.reified(), item.fields.status), previousGame: decodeFromFieldsWithTypes(Option.reified(GameResult.reified()), item.fields.previousGame), previousRound: decodeFromFieldsWithTypes(Option.reified(RoundResult.reified()), item.fields.previousRound), playerSelections: decodeFromFieldsWithTypes(VecMap.reified(Coord.reified(), "u16"), item.fields.playerSelections), prizePool: decodeFromFieldsWithTypes(Balance.reified(typeArgs[1]), item.fields.prizePool), players: decodeFromFieldsWithTypes(Table.reified(reified.phantom("address"), reified.phantom(PlayerProgress.reified())), item.fields.players) } ) }

 static fromBcs<STAKE extends PhantomReified<PhantomTypeArgument>, PRIZE extends PhantomReified<PhantomTypeArgument>>( typeArgs: [STAKE, PRIZE], data: Uint8Array ): Board<ToPhantomTypeArgument<STAKE>, ToPhantomTypeArgument<PRIZE>> { return Board.fromFields( typeArgs, Board.bcs.parse(data) ) }

 toJSONField() { return {

 id: this.id,admin: this.admin,adminFees: this.adminFees.toJSONField(),rake: this.rake,stakeRequirement: this.stakeRequirement.toString(),entryFee: this.entryFee.toString(),currentGame: this.currentGame,mineDensity: this.mineDensity,status: this.status.toJSONField(),previousGame: fieldToJSON<Option<GameResult>>(`${Option.$typeName}<${GameResult.$typeName}>`, this.previousGame),previousRound: fieldToJSON<Option<RoundResult>>(`${Option.$typeName}<${RoundResult.$typeName}>`, this.previousRound),playerSelections: this.playerSelections.toJSONField(),prizePool: this.prizePool.toJSONField(),players: this.players.toJSONField(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<STAKE extends PhantomReified<PhantomTypeArgument>, PRIZE extends PhantomReified<PhantomTypeArgument>>( typeArgs: [STAKE, PRIZE], field: any ): Board<ToPhantomTypeArgument<STAKE>, ToPhantomTypeArgument<PRIZE>> { return Board.reified( typeArgs[0], typeArgs[1], ).new( { id: decodeFromJSONField(UID.reified(), field.id), admin: decodeFromJSONField("address", field.admin), adminFees: decodeFromJSONField(Balance.reified(typeArgs[1]), field.adminFees), rake: decodeFromJSONField("u8", field.rake), stakeRequirement: decodeFromJSONField("u64", field.stakeRequirement), entryFee: decodeFromJSONField("u64", field.entryFee), currentGame: decodeFromJSONField("u32", field.currentGame), mineDensity: decodeFromJSONField("u8", field.mineDensity), status: decodeFromJSONField(GameStatus.reified(), field.status), previousGame: decodeFromJSONField(Option.reified(GameResult.reified()), field.previousGame), previousRound: decodeFromJSONField(Option.reified(RoundResult.reified()), field.previousRound), playerSelections: decodeFromJSONField(VecMap.reified(Coord.reified(), "u16"), field.playerSelections), prizePool: decodeFromJSONField(Balance.reified(typeArgs[1]), field.prizePool), players: decodeFromJSONField(Table.reified(reified.phantom("address"), reified.phantom(PlayerProgress.reified())), field.players) } ) }

 static fromJSON<STAKE extends PhantomReified<PhantomTypeArgument>, PRIZE extends PhantomReified<PhantomTypeArgument>>( typeArgs: [STAKE, PRIZE], json: Record<string, any> ): Board<ToPhantomTypeArgument<STAKE>, ToPhantomTypeArgument<PRIZE>> { if (json.$typeName !== Board.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(Board.$typeName, ...typeArgs.map(extractType)), json.$typeArgs, typeArgs, )

 return Board.fromJSONField( typeArgs, json, ) }

 static fromSuiParsedData<STAKE extends PhantomReified<PhantomTypeArgument>, PRIZE extends PhantomReified<PhantomTypeArgument>>( typeArgs: [STAKE, PRIZE], content: SuiParsedData ): Board<ToPhantomTypeArgument<STAKE>, ToPhantomTypeArgument<PRIZE>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isBoard(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a Board object`); } return Board.fromFieldsWithTypes( typeArgs, content ); }

 static fromSuiObjectData<STAKE extends PhantomReified<PhantomTypeArgument>, PRIZE extends PhantomReified<PhantomTypeArgument>>( typeArgs: [STAKE, PRIZE], data: SuiObjectData ): Board<ToPhantomTypeArgument<STAKE>, ToPhantomTypeArgument<PRIZE>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isBoard(data.bcs.type)) { throw new Error(`object at is not a Board object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 2) { throw new Error(`type argument mismatch: expected 2 type arguments but got ${gotTypeArgs.length}`); }; for (let i = 0; i < 2; i++) { const gotTypeArg = compressSuiType(gotTypeArgs[i]); const expectedTypeArg = compressSuiType(extractType(typeArgs[i])); if (gotTypeArg !== expectedTypeArg) { throw new Error(`type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); } };

 return Board.fromBcs( typeArgs, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return Board.fromSuiParsedData( typeArgs, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<STAKE extends PhantomReified<PhantomTypeArgument>, PRIZE extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArgs: [STAKE, PRIZE], id: string ): Promise<Board<ToPhantomTypeArgument<STAKE>, ToPhantomTypeArgument<PRIZE>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching Board object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isBoard(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a Board object`); }

 return Board.fromSuiObjectData( typeArgs, res.data ); }

 }

/* ============================== Coord =============================== */

export function isCoord(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V1}::board::Coord`; }

export interface CoordFields { x: ToField<"u16">; y: ToField<"u16"> }

export type CoordReified = Reified< Coord, CoordFields >;

export class Coord implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::board::Coord`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = Coord.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::board::Coord`; readonly $typeArgs: []; readonly $isPhantom = Coord.$isPhantom;

 readonly x: ToField<"u16">; readonly y: ToField<"u16">

 private constructor(typeArgs: [], fields: CoordFields, ) { this.$fullTypeName = composeSuiType( Coord.$typeName, ...typeArgs ) as `${typeof PKG_V1}::board::Coord`; this.$typeArgs = typeArgs;

 this.x = fields.x;; this.y = fields.y; }

 static reified( ): CoordReified { return { typeName: Coord.$typeName, fullTypeName: composeSuiType( Coord.$typeName, ...[] ) as `${typeof PKG_V1}::board::Coord`, typeArgs: [ ] as [], isPhantom: Coord.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => Coord.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => Coord.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => Coord.fromBcs( data, ), bcs: Coord.bcs, fromJSONField: (field: any) => Coord.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => Coord.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => Coord.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => Coord.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => Coord.fetch( client, id, ), new: ( fields: CoordFields, ) => { return new Coord( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return Coord.reified() }

 static phantom( ): PhantomReified<ToTypeStr<Coord>> { return phantom(Coord.reified( )); } static get p() { return Coord.phantom() }

 static get bcs() { return bcs.struct("Coord", {

 x: bcs.u16(), y: bcs.u16()

}) };

 static fromFields( fields: Record<string, any> ): Coord { return Coord.reified( ).new( { x: decodeFromFields("u16", fields.x), y: decodeFromFields("u16", fields.y) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): Coord { if (!isCoord(item.type)) { throw new Error("not a Coord type");

 }

 return Coord.reified( ).new( { x: decodeFromFieldsWithTypes("u16", item.fields.x), y: decodeFromFieldsWithTypes("u16", item.fields.y) } ) }

 static fromBcs( data: Uint8Array ): Coord { return Coord.fromFields( Coord.bcs.parse(data) ) }

 toJSONField() { return {

 x: this.x,y: this.y,

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): Coord { return Coord.reified( ).new( { x: decodeFromJSONField("u16", field.x), y: decodeFromJSONField("u16", field.y) } ) }

 static fromJSON( json: Record<string, any> ): Coord { if (json.$typeName !== Coord.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return Coord.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): Coord { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isCoord(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a Coord object`); } return Coord.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): Coord { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isCoord(data.bcs.type)) { throw new Error(`object at is not a Coord object`); }

 return Coord.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return Coord.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<Coord> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching Coord object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isCoord(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a Coord object`); }

 return Coord.fromSuiObjectData( res.data ); }

 }

/* ============================== GameResult =============================== */

export function isGameResult(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V1}::board::GameResult`; }

export interface GameResultFields { startingPlayers: ToField<"u16">; winner: ToField<"address">; round: ToField<"u16">; endedTs: ToField<"u64"> }

export type GameResultReified = Reified< GameResult, GameResultFields >;

export class GameResult implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::board::GameResult`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = GameResult.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::board::GameResult`; readonly $typeArgs: []; readonly $isPhantom = GameResult.$isPhantom;

 readonly startingPlayers: ToField<"u16">; readonly winner: ToField<"address">; readonly round: ToField<"u16">; readonly endedTs: ToField<"u64">

 private constructor(typeArgs: [], fields: GameResultFields, ) { this.$fullTypeName = composeSuiType( GameResult.$typeName, ...typeArgs ) as `${typeof PKG_V1}::board::GameResult`; this.$typeArgs = typeArgs;

 this.startingPlayers = fields.startingPlayers;; this.winner = fields.winner;; this.round = fields.round;; this.endedTs = fields.endedTs; }

 static reified( ): GameResultReified { return { typeName: GameResult.$typeName, fullTypeName: composeSuiType( GameResult.$typeName, ...[] ) as `${typeof PKG_V1}::board::GameResult`, typeArgs: [ ] as [], isPhantom: GameResult.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => GameResult.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => GameResult.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => GameResult.fromBcs( data, ), bcs: GameResult.bcs, fromJSONField: (field: any) => GameResult.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => GameResult.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => GameResult.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => GameResult.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => GameResult.fetch( client, id, ), new: ( fields: GameResultFields, ) => { return new GameResult( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return GameResult.reified() }

 static phantom( ): PhantomReified<ToTypeStr<GameResult>> { return phantom(GameResult.reified( )); } static get p() { return GameResult.phantom() }

 static get bcs() { return bcs.struct("GameResult", {

 startingPlayers: bcs.u16(), winner: bcs.bytes(32).transform({ input: (val: string) => fromHEX(val), output: (val: Uint8Array) => toHEX(val), }), round: bcs.u16(), endedTs: bcs.u64()

}) };

 static fromFields( fields: Record<string, any> ): GameResult { return GameResult.reified( ).new( { startingPlayers: decodeFromFields("u16", fields.startingPlayers), winner: decodeFromFields("address", fields.winner), round: decodeFromFields("u16", fields.round), endedTs: decodeFromFields("u64", fields.endedTs) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): GameResult { if (!isGameResult(item.type)) { throw new Error("not a GameResult type");

 }

 return GameResult.reified( ).new( { startingPlayers: decodeFromFieldsWithTypes("u16", item.fields.startingPlayers), winner: decodeFromFieldsWithTypes("address", item.fields.winner), round: decodeFromFieldsWithTypes("u16", item.fields.round), endedTs: decodeFromFieldsWithTypes("u64", item.fields.endedTs) } ) }

 static fromBcs( data: Uint8Array ): GameResult { return GameResult.fromFields( GameResult.bcs.parse(data) ) }

 toJSONField() { return {

 startingPlayers: this.startingPlayers,winner: this.winner,round: this.round,endedTs: this.endedTs.toString(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): GameResult { return GameResult.reified( ).new( { startingPlayers: decodeFromJSONField("u16", field.startingPlayers), winner: decodeFromJSONField("address", field.winner), round: decodeFromJSONField("u16", field.round), endedTs: decodeFromJSONField("u64", field.endedTs) } ) }

 static fromJSON( json: Record<string, any> ): GameResult { if (json.$typeName !== GameResult.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return GameResult.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): GameResult { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isGameResult(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a GameResult object`); } return GameResult.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): GameResult { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isGameResult(data.bcs.type)) { throw new Error(`object at is not a GameResult object`); }

 return GameResult.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return GameResult.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<GameResult> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching GameResult object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isGameResult(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a GameResult object`); }

 return GameResult.fromSuiObjectData( res.data ); }

 }

/* ============================== PlayerProgress =============================== */

export function isPlayerProgress(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V1}::board::PlayerProgress`; }

export interface PlayerProgressFields { game: ToField<"u32">; round: ToField<"u16">; selection: ToField<Option<Coord>> }

export type PlayerProgressReified = Reified< PlayerProgress, PlayerProgressFields >;

export class PlayerProgress implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::board::PlayerProgress`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = PlayerProgress.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::board::PlayerProgress`; readonly $typeArgs: []; readonly $isPhantom = PlayerProgress.$isPhantom;

 readonly game: ToField<"u32">; readonly round: ToField<"u16">; readonly selection: ToField<Option<Coord>>

 private constructor(typeArgs: [], fields: PlayerProgressFields, ) { this.$fullTypeName = composeSuiType( PlayerProgress.$typeName, ...typeArgs ) as `${typeof PKG_V1}::board::PlayerProgress`; this.$typeArgs = typeArgs;

 this.game = fields.game;; this.round = fields.round;; this.selection = fields.selection; }

 static reified( ): PlayerProgressReified { return { typeName: PlayerProgress.$typeName, fullTypeName: composeSuiType( PlayerProgress.$typeName, ...[] ) as `${typeof PKG_V1}::board::PlayerProgress`, typeArgs: [ ] as [], isPhantom: PlayerProgress.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => PlayerProgress.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => PlayerProgress.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => PlayerProgress.fromBcs( data, ), bcs: PlayerProgress.bcs, fromJSONField: (field: any) => PlayerProgress.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => PlayerProgress.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => PlayerProgress.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => PlayerProgress.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => PlayerProgress.fetch( client, id, ), new: ( fields: PlayerProgressFields, ) => { return new PlayerProgress( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return PlayerProgress.reified() }

 static phantom( ): PhantomReified<ToTypeStr<PlayerProgress>> { return phantom(PlayerProgress.reified( )); } static get p() { return PlayerProgress.phantom() }

 static get bcs() { return bcs.struct("PlayerProgress", {

 game: bcs.u32(), round: bcs.u16(), selection: Option.bcs(Coord.bcs)

}) };

 static fromFields( fields: Record<string, any> ): PlayerProgress { return PlayerProgress.reified( ).new( { game: decodeFromFields("u32", fields.game), round: decodeFromFields("u16", fields.round), selection: decodeFromFields(Option.reified(Coord.reified()), fields.selection) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): PlayerProgress { if (!isPlayerProgress(item.type)) { throw new Error("not a PlayerProgress type");

 }

 return PlayerProgress.reified( ).new( { game: decodeFromFieldsWithTypes("u32", item.fields.game), round: decodeFromFieldsWithTypes("u16", item.fields.round), selection: decodeFromFieldsWithTypes(Option.reified(Coord.reified()), item.fields.selection) } ) }

 static fromBcs( data: Uint8Array ): PlayerProgress { return PlayerProgress.fromFields( PlayerProgress.bcs.parse(data) ) }

 toJSONField() { return {

 game: this.game,round: this.round,selection: fieldToJSON<Option<Coord>>(`${Option.$typeName}<${Coord.$typeName}>`, this.selection),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): PlayerProgress { return PlayerProgress.reified( ).new( { game: decodeFromJSONField("u32", field.game), round: decodeFromJSONField("u16", field.round), selection: decodeFromJSONField(Option.reified(Coord.reified()), field.selection) } ) }

 static fromJSON( json: Record<string, any> ): PlayerProgress { if (json.$typeName !== PlayerProgress.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return PlayerProgress.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): PlayerProgress { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isPlayerProgress(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a PlayerProgress object`); } return PlayerProgress.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): PlayerProgress { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isPlayerProgress(data.bcs.type)) { throw new Error(`object at is not a PlayerProgress object`); }

 return PlayerProgress.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return PlayerProgress.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<PlayerProgress> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching PlayerProgress object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isPlayerProgress(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a PlayerProgress object`); }

 return PlayerProgress.fromSuiObjectData( res.data ); }

 }

/* ============================== RegisterEvent =============================== */

export function isRegisterEvent(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V1}::board::RegisterEvent`; }

export interface RegisterEventFields { player: ToField<"address">; board: ToField<ID> }

export type RegisterEventReified = Reified< RegisterEvent, RegisterEventFields >;

export class RegisterEvent implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::board::RegisterEvent`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = RegisterEvent.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::board::RegisterEvent`; readonly $typeArgs: []; readonly $isPhantom = RegisterEvent.$isPhantom;

 readonly player: ToField<"address">; readonly board: ToField<ID>

 private constructor(typeArgs: [], fields: RegisterEventFields, ) { this.$fullTypeName = composeSuiType( RegisterEvent.$typeName, ...typeArgs ) as `${typeof PKG_V1}::board::RegisterEvent`; this.$typeArgs = typeArgs;

 this.player = fields.player;; this.board = fields.board; }

 static reified( ): RegisterEventReified { return { typeName: RegisterEvent.$typeName, fullTypeName: composeSuiType( RegisterEvent.$typeName, ...[] ) as `${typeof PKG_V1}::board::RegisterEvent`, typeArgs: [ ] as [], isPhantom: RegisterEvent.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => RegisterEvent.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => RegisterEvent.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => RegisterEvent.fromBcs( data, ), bcs: RegisterEvent.bcs, fromJSONField: (field: any) => RegisterEvent.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => RegisterEvent.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => RegisterEvent.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => RegisterEvent.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => RegisterEvent.fetch( client, id, ), new: ( fields: RegisterEventFields, ) => { return new RegisterEvent( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return RegisterEvent.reified() }

 static phantom( ): PhantomReified<ToTypeStr<RegisterEvent>> { return phantom(RegisterEvent.reified( )); } static get p() { return RegisterEvent.phantom() }

 static get bcs() { return bcs.struct("RegisterEvent", {

 player: bcs.bytes(32).transform({ input: (val: string) => fromHEX(val), output: (val: Uint8Array) => toHEX(val), }), board: ID.bcs

}) };

 static fromFields( fields: Record<string, any> ): RegisterEvent { return RegisterEvent.reified( ).new( { player: decodeFromFields("address", fields.player), board: decodeFromFields(ID.reified(), fields.board) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): RegisterEvent { if (!isRegisterEvent(item.type)) { throw new Error("not a RegisterEvent type");

 }

 return RegisterEvent.reified( ).new( { player: decodeFromFieldsWithTypes("address", item.fields.player), board: decodeFromFieldsWithTypes(ID.reified(), item.fields.board) } ) }

 static fromBcs( data: Uint8Array ): RegisterEvent { return RegisterEvent.fromFields( RegisterEvent.bcs.parse(data) ) }

 toJSONField() { return {

 player: this.player,board: this.board,

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): RegisterEvent { return RegisterEvent.reified( ).new( { player: decodeFromJSONField("address", field.player), board: decodeFromJSONField(ID.reified(), field.board) } ) }

 static fromJSON( json: Record<string, any> ): RegisterEvent { if (json.$typeName !== RegisterEvent.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return RegisterEvent.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): RegisterEvent { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isRegisterEvent(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a RegisterEvent object`); } return RegisterEvent.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): RegisterEvent { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isRegisterEvent(data.bcs.type)) { throw new Error(`object at is not a RegisterEvent object`); }

 return RegisterEvent.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return RegisterEvent.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<RegisterEvent> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching RegisterEvent object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isRegisterEvent(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a RegisterEvent object`); }

 return RegisterEvent.fromSuiObjectData( res.data ); }

 }

/* ============================== RoundResult =============================== */

export function isRoundResult(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V1}::board::RoundResult`; }

export interface RoundResultFields { status: ToField<RoundStatus>; survivors: ToField<"u16">; eliminated: ToField<"u16">; mines: ToField<VecSet<Coord>>; playerSelections: ToField<VecMap<Coord, "u16">> }

export type RoundResultReified = Reified< RoundResult, RoundResultFields >;

export class RoundResult implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::board::RoundResult`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = RoundResult.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::board::RoundResult`; readonly $typeArgs: []; readonly $isPhantom = RoundResult.$isPhantom;

 readonly status: ToField<RoundStatus>; readonly survivors: ToField<"u16">; readonly eliminated: ToField<"u16">; readonly mines: ToField<VecSet<Coord>>; readonly playerSelections: ToField<VecMap<Coord, "u16">>

 private constructor(typeArgs: [], fields: RoundResultFields, ) { this.$fullTypeName = composeSuiType( RoundResult.$typeName, ...typeArgs ) as `${typeof PKG_V1}::board::RoundResult`; this.$typeArgs = typeArgs;

 this.status = fields.status;; this.survivors = fields.survivors;; this.eliminated = fields.eliminated;; this.mines = fields.mines;; this.playerSelections = fields.playerSelections; }

 static reified( ): RoundResultReified { return { typeName: RoundResult.$typeName, fullTypeName: composeSuiType( RoundResult.$typeName, ...[] ) as `${typeof PKG_V1}::board::RoundResult`, typeArgs: [ ] as [], isPhantom: RoundResult.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => RoundResult.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => RoundResult.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => RoundResult.fromBcs( data, ), bcs: RoundResult.bcs, fromJSONField: (field: any) => RoundResult.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => RoundResult.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => RoundResult.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => RoundResult.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => RoundResult.fetch( client, id, ), new: ( fields: RoundResultFields, ) => { return new RoundResult( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return RoundResult.reified() }

 static phantom( ): PhantomReified<ToTypeStr<RoundResult>> { return phantom(RoundResult.reified( )); } static get p() { return RoundResult.phantom() }

 static get bcs() { return bcs.struct("RoundResult", {

 status: RoundStatus.bcs, survivors: bcs.u16(), eliminated: bcs.u16(), mines: VecSet.bcs(Coord.bcs), playerSelections: VecMap.bcs(Coord.bcs, bcs.u16())

}) };

 static fromFields( fields: Record<string, any> ): RoundResult { return RoundResult.reified( ).new( { status: decodeFromFields(RoundStatus.reified(), fields.status), survivors: decodeFromFields("u16", fields.survivors), eliminated: decodeFromFields("u16", fields.eliminated), mines: decodeFromFields(VecSet.reified(Coord.reified()), fields.mines), playerSelections: decodeFromFields(VecMap.reified(Coord.reified(), "u16"), fields.playerSelections) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): RoundResult { if (!isRoundResult(item.type)) { throw new Error("not a RoundResult type");

 }

 return RoundResult.reified( ).new( { status: decodeFromFieldsWithTypes(RoundStatus.reified(), item.fields.status), survivors: decodeFromFieldsWithTypes("u16", item.fields.survivors), eliminated: decodeFromFieldsWithTypes("u16", item.fields.eliminated), mines: decodeFromFieldsWithTypes(VecSet.reified(Coord.reified()), item.fields.mines), playerSelections: decodeFromFieldsWithTypes(VecMap.reified(Coord.reified(), "u16"), item.fields.playerSelections) } ) }

 static fromBcs( data: Uint8Array ): RoundResult { return RoundResult.fromFields( RoundResult.bcs.parse(data) ) }

 toJSONField() { return {

 status: this.status.toJSONField(),survivors: this.survivors,eliminated: this.eliminated,mines: this.mines.toJSONField(),playerSelections: this.playerSelections.toJSONField(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): RoundResult { return RoundResult.reified( ).new( { status: decodeFromJSONField(RoundStatus.reified(), field.status), survivors: decodeFromJSONField("u16", field.survivors), eliminated: decodeFromJSONField("u16", field.eliminated), mines: decodeFromJSONField(VecSet.reified(Coord.reified()), field.mines), playerSelections: decodeFromJSONField(VecMap.reified(Coord.reified(), "u16"), field.playerSelections) } ) }

 static fromJSON( json: Record<string, any> ): RoundResult { if (json.$typeName !== RoundResult.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return RoundResult.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): RoundResult { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isRoundResult(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a RoundResult object`); } return RoundResult.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): RoundResult { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isRoundResult(data.bcs.type)) { throw new Error(`object at is not a RoundResult object`); }

 return RoundResult.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return RoundResult.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<RoundResult> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching RoundResult object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isRoundResult(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a RoundResult object`); }

 return RoundResult.fromSuiObjectData( res.data ); }

 }

/* ============================== TestnetAdminCap =============================== */

export function isTestnetAdminCap(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V1}::board::TestnetAdminCap`; }

export interface TestnetAdminCapFields { id: ToField<UID> }

export type TestnetAdminCapReified = Reified< TestnetAdminCap, TestnetAdminCapFields >;

export class TestnetAdminCap implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::board::TestnetAdminCap`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = TestnetAdminCap.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::board::TestnetAdminCap`; readonly $typeArgs: []; readonly $isPhantom = TestnetAdminCap.$isPhantom;

 readonly id: ToField<UID>

 private constructor(typeArgs: [], fields: TestnetAdminCapFields, ) { this.$fullTypeName = composeSuiType( TestnetAdminCap.$typeName, ...typeArgs ) as `${typeof PKG_V1}::board::TestnetAdminCap`; this.$typeArgs = typeArgs;

 this.id = fields.id; }

 static reified( ): TestnetAdminCapReified { return { typeName: TestnetAdminCap.$typeName, fullTypeName: composeSuiType( TestnetAdminCap.$typeName, ...[] ) as `${typeof PKG_V1}::board::TestnetAdminCap`, typeArgs: [ ] as [], isPhantom: TestnetAdminCap.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => TestnetAdminCap.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => TestnetAdminCap.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => TestnetAdminCap.fromBcs( data, ), bcs: TestnetAdminCap.bcs, fromJSONField: (field: any) => TestnetAdminCap.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => TestnetAdminCap.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => TestnetAdminCap.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => TestnetAdminCap.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => TestnetAdminCap.fetch( client, id, ), new: ( fields: TestnetAdminCapFields, ) => { return new TestnetAdminCap( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return TestnetAdminCap.reified() }

 static phantom( ): PhantomReified<ToTypeStr<TestnetAdminCap>> { return phantom(TestnetAdminCap.reified( )); } static get p() { return TestnetAdminCap.phantom() }

 static get bcs() { return bcs.struct("TestnetAdminCap", {

 id: UID.bcs

}) };

 static fromFields( fields: Record<string, any> ): TestnetAdminCap { return TestnetAdminCap.reified( ).new( { id: decodeFromFields(UID.reified(), fields.id) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): TestnetAdminCap { if (!isTestnetAdminCap(item.type)) { throw new Error("not a TestnetAdminCap type");

 }

 return TestnetAdminCap.reified( ).new( { id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id) } ) }

 static fromBcs( data: Uint8Array ): TestnetAdminCap { return TestnetAdminCap.fromFields( TestnetAdminCap.bcs.parse(data) ) }

 toJSONField() { return {

 id: this.id,

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): TestnetAdminCap { return TestnetAdminCap.reified( ).new( { id: decodeFromJSONField(UID.reified(), field.id) } ) }

 static fromJSON( json: Record<string, any> ): TestnetAdminCap { if (json.$typeName !== TestnetAdminCap.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return TestnetAdminCap.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): TestnetAdminCap { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isTestnetAdminCap(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a TestnetAdminCap object`); } return TestnetAdminCap.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): TestnetAdminCap { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isTestnetAdminCap(data.bcs.type)) { throw new Error(`object at is not a TestnetAdminCap object`); }

 return TestnetAdminCap.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return TestnetAdminCap.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<TestnetAdminCap> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching TestnetAdminCap object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isTestnetAdminCap(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a TestnetAdminCap object`); }

 return TestnetAdminCap.fromSuiObjectData( res.data ); }

 }

/* ============================== GameStatus =============================== */

export function isGameStatus(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::board::GameStatus`) }

export type GameStatusVariants = EnumOutputShapeWithKeys< { waitingToStart: { registeredPlayers: ToField<"u16">; startTimeTs: ToField<"u64"> }; playing: { startingPlayers: ToField<"u16">; round: ToField<"u16">; selectionCutoffTs: ToField<"u64">; selectionCount: ToField<"u16"> }; standby: true }, "waitingToStart" | "playing" | "standby" >;

export type GameStatusReified = Reified< GameStatus, GameStatusVariants >;

export class GameStatus implements EnumClass { static readonly $typeName = `${PKG_V1}::board::GameStatus`; static readonly $numTypeParams = 0;

 readonly $typeName = GameStatus.$typeName;

 readonly $fullTypeName: `${typeof PKG_V1}::board::GameStatus`;

 readonly $typeArgs: []; readonly $data: GameStatusVariants

 private constructor(typeArgs: [], data: GameStatusVariants) { this.$fullTypeName = composeSuiType( GameStatus.$typeName, ...typeArgs ) as `${typeof PKG_V1}::board::GameStatus`; this.$typeArgs = typeArgs;

 this.$data = data;

 }

 toJSONField() { throw new Error ("NOT IMPLEMENTED"); }

 static reified( ): GameStatusReified { return { typeName: GameStatus.$typeName, fullTypeName: composeSuiType( GameStatus.$typeName, ...[] ) as `${typeof PKG_V1}::board::GameStatus`, typeArgs: [ ] as [], reifiedTypeArgs: [], fromBcs: (data: Uint8Array) => GameStatus.fromBcs( data, ), fromFields: (data: EnumOutputShapeWithKeys<any,any>) => GameStatus.fromFields( data ), fromFieldsWithTypes: (data: EnumOutputShapeWithKeys<any,any>) => GameStatus.fromFieldsWithTypes( data ), bcs: GameStatus.bcs, new: (data: GameStatusVariants ) => { return new GameStatus( [], data ) }, kind: "EnumClassReified", } }

 static get r() { return GameStatus.reified() }

 static get bcs() { return bcs.enum("GameStatus", { waitingToStart: bcs.struct( "waitingToStart" , { registeredPlayers: bcs.u16(), startTimeTs: bcs.u64() }), playing: bcs.struct( "playing" , { startingPlayers: bcs.u16(), round: bcs.u16(), selectionCutoffTs: bcs.u64(), selectionCount: bcs.u16() }), standby: null }); }

 static fromFields(data: EnumOutputShapeWithKeys<any,any>): GameStatus {

 switch (data.$kind) {

 case "waitingToStart": return GameStatus.reified().new( { waitingToStart:{ registeredPlayers: decodeFromFields ( "u16", data.waitingToStart!.registeredPlayers, ), startTimeTs: decodeFromFields ( "u64", data.waitingToStart!.startTimeTs, ) }, $kind: "waitingToStart" } );

 case "playing": return GameStatus.reified().new( { playing:{ startingPlayers: decodeFromFields ( "u16", data.playing!.startingPlayers, ), round: decodeFromFields ( "u16", data.playing!.round, ), selectionCutoffTs: decodeFromFields ( "u64", data.playing!.selectionCutoffTs, ), selectionCount: decodeFromFields ( "u16", data.playing!.selectionCount, ) }, $kind: "playing" } );

 case "standby": return GameStatus.reified().new( { standby: true, $kind: "standby" } );

 default:

 throw new Error( " unknown variant: " + data.$kind ); } }

 static fromFieldsWithTypes(data: EnumOutputShapeWithKeys<any,any>): GameStatus {

 switch (data.$kind) {

 case "waitingToStart": return GameStatus.reified().new( { waitingToStart:{ registeredPlayers: decodeFromFieldsWithTypes ( "u16", data.waitingToStart!.registeredPlayers, ), startTimeTs: decodeFromFieldsWithTypes ( "u64", data.waitingToStart!.startTimeTs, ) }, $kind: "waitingToStart" } );

 case "playing": return GameStatus.reified().new( { playing:{ startingPlayers: decodeFromFieldsWithTypes ( "u16", data.playing!.startingPlayers, ), round: decodeFromFieldsWithTypes ( "u16", data.playing!.round, ), selectionCutoffTs: decodeFromFieldsWithTypes ( "u64", data.playing!.selectionCutoffTs, ), selectionCount: decodeFromFieldsWithTypes ( "u16", data.playing!.selectionCount, ) }, $kind: "playing" } );

 case "standby": return GameStatus.reified().new( { standby: true, $kind: "standby" } );

 default:

 throw new Error( " unknown variant: " + data.$kind ); } }

 static fromBcs( data: Uint8Array ): GameStatus {

 return GameStatus.fromFields(GameStatus.bcs.parse(data)) }

 }

/* ============================== RoundStatus =============================== */

export function isRoundStatus(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::board::RoundStatus`) }

export type RoundStatusVariants = EnumOutputShapeWithKeys< { proceed: true; wipeout: true; final: { endTs: ToField<"u64"> } }, "proceed" | "wipeout" | "final" >;

export type RoundStatusReified = Reified< RoundStatus, RoundStatusVariants >;

export class RoundStatus implements EnumClass { static readonly $typeName = `${PKG_V1}::board::RoundStatus`; static readonly $numTypeParams = 0;

 readonly $typeName = RoundStatus.$typeName;

 readonly $fullTypeName: `${typeof PKG_V1}::board::RoundStatus`;

 readonly $typeArgs: []; readonly $data: RoundStatusVariants

 private constructor(typeArgs: [], data: RoundStatusVariants) { this.$fullTypeName = composeSuiType( RoundStatus.$typeName, ...typeArgs ) as `${typeof PKG_V1}::board::RoundStatus`; this.$typeArgs = typeArgs;

 this.$data = data;

 }

 toJSONField() { throw new Error ("NOT IMPLEMENTED"); }

 static reified( ): RoundStatusReified { return { typeName: RoundStatus.$typeName, fullTypeName: composeSuiType( RoundStatus.$typeName, ...[] ) as `${typeof PKG_V1}::board::RoundStatus`, typeArgs: [ ] as [], reifiedTypeArgs: [], fromBcs: (data: Uint8Array) => RoundStatus.fromBcs( data, ), fromFields: (data: EnumOutputShapeWithKeys<any,any>) => RoundStatus.fromFields( data ), fromFieldsWithTypes: (data: EnumOutputShapeWithKeys<any,any>) => RoundStatus.fromFieldsWithTypes( data ), bcs: RoundStatus.bcs, new: (data: RoundStatusVariants ) => { return new RoundStatus( [], data ) }, kind: "EnumClassReified", } }

 static get r() { return RoundStatus.reified() }

 static get bcs() { return bcs.enum("RoundStatus", { proceed: null, wipeout: null, final: bcs.struct( "final" , { endTs: bcs.u64() }) }); }

 static fromFields(data: EnumOutputShapeWithKeys<any,any>): RoundStatus {

 switch (data.$kind) {

 case "proceed": return RoundStatus.reified().new( { proceed: true, $kind: "proceed" } );

 case "wipeout": return RoundStatus.reified().new( { wipeout: true, $kind: "wipeout" } );

 case "final": return RoundStatus.reified().new( { final:{ endTs: decodeFromFields ( "u64", data.final!.endTs, ) }, $kind: "final" } );

 default:

 throw new Error( " unknown variant: " + data.$kind ); } }

 static fromFieldsWithTypes(data: EnumOutputShapeWithKeys<any,any>): RoundStatus {

 switch (data.$kind) {

 case "proceed": return RoundStatus.reified().new( { proceed: true, $kind: "proceed" } );

 case "wipeout": return RoundStatus.reified().new( { wipeout: true, $kind: "wipeout" } );

 case "final": return RoundStatus.reified().new( { final:{ endTs: decodeFromFieldsWithTypes ( "u64", data.final!.endTs, ) }, $kind: "final" } );

 default:

 throw new Error( " unknown variant: " + data.$kind ); } }

 static fromBcs( data: Uint8Array ): RoundStatus {

 return RoundStatus.fromFields(RoundStatus.bcs.parse(data)) }

 }
