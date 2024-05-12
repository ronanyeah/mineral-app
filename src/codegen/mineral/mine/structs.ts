import * as reified from "../../_framework/reified";
import {Balance} from "../../_dependencies/source/0x2/balance/structs";
import {UID} from "../../_dependencies/source/0x2/object/structs";
import {Locker} from "../../_dependencies/source/0xbafd431cc9362367d02dc2752216782a265216af069d70a7679de5f38c0d62ca/locker/structs";
import {PhantomReified, Reified, StructClass, ToField, ToTypeStr, decodeFromFields, decodeFromFieldsWithTypes, decodeFromJSONField, phantom, ToTypeStr as ToPhantom} from "../../_framework/reified";
import {FieldsWithTypes, composeSuiType, compressSuiType} from "../../_framework/util";
import {bcs, fromB64} from "@mysten/bcs";
import {SuiClient, SuiParsedData} from "@mysten/sui.js/client";

/* ============================== AdminCap =============================== */

export function isAdminCap(type: string): boolean { type = compressSuiType(type); return type === "0x9cde6fd22c9518820644dd1350ac1595bb23751033d247465ff3c7572d9a7049::mine::AdminCap"; }

export interface AdminCapFields { id: ToField<UID> }

export type AdminCapReified = Reified< AdminCap, AdminCapFields >;

export class AdminCap implements StructClass { static readonly $typeName = "0x9cde6fd22c9518820644dd1350ac1595bb23751033d247465ff3c7572d9a7049::mine::AdminCap"; static readonly $numTypeParams = 0;

 readonly $typeName = AdminCap.$typeName;

 readonly $fullTypeName: "0x9cde6fd22c9518820644dd1350ac1595bb23751033d247465ff3c7572d9a7049::mine::AdminCap";

 readonly $typeArgs: [];

 readonly id: ToField<UID>

 private constructor(typeArgs: [], fields: AdminCapFields, ) { this.$fullTypeName = composeSuiType( AdminCap.$typeName, ...typeArgs ) as "0x9cde6fd22c9518820644dd1350ac1595bb23751033d247465ff3c7572d9a7049::mine::AdminCap"; this.$typeArgs = typeArgs;

 this.id = fields.id; }

 static reified( ): AdminCapReified { return { typeName: AdminCap.$typeName, fullTypeName: composeSuiType( AdminCap.$typeName, ...[] ) as "0x9cde6fd22c9518820644dd1350ac1595bb23751033d247465ff3c7572d9a7049::mine::AdminCap", typeArgs: [ ] as [], reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => AdminCap.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => AdminCap.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => AdminCap.fromBcs( data, ), bcs: AdminCap.bcs, fromJSONField: (field: any) => AdminCap.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => AdminCap.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => AdminCap.fromSuiParsedData( content, ), fetch: async (client: SuiClient, id: string) => AdminCap.fetch( client, id, ), new: ( fields: AdminCapFields, ) => { return new AdminCap( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return AdminCap.reified() }

 static phantom( ): PhantomReified<ToTypeStr<AdminCap>> { return phantom(AdminCap.reified( )); } static get p() { return AdminCap.phantom() }

 static get bcs() { return bcs.struct("AdminCap", {

 id: UID.bcs

}) };

 static fromFields( fields: Record<string, any> ): AdminCap { return AdminCap.reified( ).new( { id: decodeFromFields(UID.reified(), fields.id) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): AdminCap { if (!isAdminCap(item.type)) { throw new Error("not a AdminCap type");

 }

 return AdminCap.reified( ).new( { id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id) } ) }

 static fromBcs( data: Uint8Array ): AdminCap { return AdminCap.fromFields( AdminCap.bcs.parse(data) ) }

 toJSONField() { return {

 id: this.id,

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): AdminCap { return AdminCap.reified( ).new( { id: decodeFromJSONField(UID.reified(), field.id) } ) }

 static fromJSON( json: Record<string, any> ): AdminCap { if (json.$typeName !== AdminCap.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return AdminCap.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): AdminCap { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isAdminCap(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a AdminCap object`); } return AdminCap.fromFieldsWithTypes( content ); }

 static async fetch( client: SuiClient, id: string ): Promise<AdminCap> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching AdminCap object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isAdminCap(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a AdminCap object`); }
 return AdminCap.fromBcs( fromB64(res.data.bcs.bcsBytes) ); }

 }

/* ============================== Bus =============================== */

export function isBus(type: string): boolean { type = compressSuiType(type); return type === "0x9cde6fd22c9518820644dd1350ac1595bb23751033d247465ff3c7572d9a7049::mine::Bus"; }

export interface BusFields { id: ToField<UID>; version: ToField<"u8">; live: ToField<"bool">; difficulty: ToField<"u8">; rewardRate: ToField<"u64">; lastReset: ToField<"u64">; rewards: ToField<Balance<ToPhantom<MINE>>>; epochHashes: ToField<"u64"> }

export type BusReified = Reified< Bus, BusFields >;

export class Bus implements StructClass { static readonly $typeName = "0x9cde6fd22c9518820644dd1350ac1595bb23751033d247465ff3c7572d9a7049::mine::Bus"; static readonly $numTypeParams = 0;

 readonly $typeName = Bus.$typeName;

 readonly $fullTypeName: "0x9cde6fd22c9518820644dd1350ac1595bb23751033d247465ff3c7572d9a7049::mine::Bus";

 readonly $typeArgs: [];

 readonly id: ToField<UID>; readonly version: ToField<"u8">; readonly live: ToField<"bool">; readonly difficulty: ToField<"u8">; readonly rewardRate: ToField<"u64">; readonly lastReset: ToField<"u64">; readonly rewards: ToField<Balance<ToPhantom<MINE>>>; readonly epochHashes: ToField<"u64">

 private constructor(typeArgs: [], fields: BusFields, ) { this.$fullTypeName = composeSuiType( Bus.$typeName, ...typeArgs ) as "0x9cde6fd22c9518820644dd1350ac1595bb23751033d247465ff3c7572d9a7049::mine::Bus"; this.$typeArgs = typeArgs;

 this.id = fields.id;; this.version = fields.version;; this.live = fields.live;; this.difficulty = fields.difficulty;; this.rewardRate = fields.rewardRate;; this.lastReset = fields.lastReset;; this.rewards = fields.rewards;; this.epochHashes = fields.epochHashes; }

 static reified( ): BusReified { return { typeName: Bus.$typeName, fullTypeName: composeSuiType( Bus.$typeName, ...[] ) as "0x9cde6fd22c9518820644dd1350ac1595bb23751033d247465ff3c7572d9a7049::mine::Bus", typeArgs: [ ] as [], reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => Bus.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => Bus.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => Bus.fromBcs( data, ), bcs: Bus.bcs, fromJSONField: (field: any) => Bus.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => Bus.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => Bus.fromSuiParsedData( content, ), fetch: async (client: SuiClient, id: string) => Bus.fetch( client, id, ), new: ( fields: BusFields, ) => { return new Bus( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return Bus.reified() }

 static phantom( ): PhantomReified<ToTypeStr<Bus>> { return phantom(Bus.reified( )); } static get p() { return Bus.phantom() }

 static get bcs() { return bcs.struct("Bus", {

 id: UID.bcs, version: bcs.u8(), live: bcs.bool(), difficulty: bcs.u8(), reward_rate: bcs.u64(), last_reset: bcs.u64(), rewards: Balance.bcs, epoch_hashes: bcs.u64()

}) };

 static fromFields( fields: Record<string, any> ): Bus { return Bus.reified( ).new( { id: decodeFromFields(UID.reified(), fields.id), version: decodeFromFields("u8", fields.version), live: decodeFromFields("bool", fields.live), difficulty: decodeFromFields("u8", fields.difficulty), rewardRate: decodeFromFields("u64", fields.reward_rate), lastReset: decodeFromFields("u64", fields.last_reset), rewards: decodeFromFields(Balance.reified(reified.phantom(MINE.reified())), fields.rewards), epochHashes: decodeFromFields("u64", fields.epoch_hashes) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): Bus { if (!isBus(item.type)) { throw new Error("not a Bus type");

 }

 return Bus.reified( ).new( { id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id), version: decodeFromFieldsWithTypes("u8", item.fields.version), live: decodeFromFieldsWithTypes("bool", item.fields.live), difficulty: decodeFromFieldsWithTypes("u8", item.fields.difficulty), rewardRate: decodeFromFieldsWithTypes("u64", item.fields.reward_rate), lastReset: decodeFromFieldsWithTypes("u64", item.fields.last_reset), rewards: decodeFromFieldsWithTypes(Balance.reified(reified.phantom(MINE.reified())), item.fields.rewards), epochHashes: decodeFromFieldsWithTypes("u64", item.fields.epoch_hashes) } ) }

 static fromBcs( data: Uint8Array ): Bus { return Bus.fromFields( Bus.bcs.parse(data) ) }

 toJSONField() { return {

 id: this.id,version: this.version,live: this.live,difficulty: this.difficulty,rewardRate: this.rewardRate.toString(),lastReset: this.lastReset.toString(),rewards: this.rewards.toJSONField(),epochHashes: this.epochHashes.toString(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): Bus { return Bus.reified( ).new( { id: decodeFromJSONField(UID.reified(), field.id), version: decodeFromJSONField("u8", field.version), live: decodeFromJSONField("bool", field.live), difficulty: decodeFromJSONField("u8", field.difficulty), rewardRate: decodeFromJSONField("u64", field.rewardRate), lastReset: decodeFromJSONField("u64", field.lastReset), rewards: decodeFromJSONField(Balance.reified(reified.phantom(MINE.reified())), field.rewards), epochHashes: decodeFromJSONField("u64", field.epochHashes) } ) }

 static fromJSON( json: Record<string, any> ): Bus { if (json.$typeName !== Bus.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return Bus.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): Bus { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isBus(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a Bus object`); } return Bus.fromFieldsWithTypes( content ); }

 static async fetch( client: SuiClient, id: string ): Promise<Bus> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching Bus object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isBus(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a Bus object`); }
 return Bus.fromBcs( fromB64(res.data.bcs.bcsBytes) ); }

 }

/* ============================== Config =============================== */

export function isConfig(type: string): boolean { type = compressSuiType(type); return type === "0x9cde6fd22c9518820644dd1350ac1595bb23751033d247465ff3c7572d9a7049::mine::Config"; }

export interface ConfigFields { id: ToField<UID>; version: ToField<"u8">; busCount: ToField<"u64">; treasury: ToField<Locker<ToPhantom<MINE>>>; lastDifficultyAdjustment: ToField<"u64">; totalRewards: ToField<"u64">; totalHashes: ToField<"u64"> }

export type ConfigReified = Reified< Config, ConfigFields >;

export class Config implements StructClass { static readonly $typeName = "0x9cde6fd22c9518820644dd1350ac1595bb23751033d247465ff3c7572d9a7049::mine::Config"; static readonly $numTypeParams = 0;

 readonly $typeName = Config.$typeName;

 readonly $fullTypeName: "0x9cde6fd22c9518820644dd1350ac1595bb23751033d247465ff3c7572d9a7049::mine::Config";

 readonly $typeArgs: [];

 readonly id: ToField<UID>; readonly version: ToField<"u8">; readonly busCount: ToField<"u64">; readonly treasury: ToField<Locker<ToPhantom<MINE>>>; readonly lastDifficultyAdjustment: ToField<"u64">; readonly totalRewards: ToField<"u64">; readonly totalHashes: ToField<"u64">

 private constructor(typeArgs: [], fields: ConfigFields, ) { this.$fullTypeName = composeSuiType( Config.$typeName, ...typeArgs ) as "0x9cde6fd22c9518820644dd1350ac1595bb23751033d247465ff3c7572d9a7049::mine::Config"; this.$typeArgs = typeArgs;

 this.id = fields.id;; this.version = fields.version;; this.busCount = fields.busCount;; this.treasury = fields.treasury;; this.lastDifficultyAdjustment = fields.lastDifficultyAdjustment;; this.totalRewards = fields.totalRewards;; this.totalHashes = fields.totalHashes; }

 static reified( ): ConfigReified { return { typeName: Config.$typeName, fullTypeName: composeSuiType( Config.$typeName, ...[] ) as "0x9cde6fd22c9518820644dd1350ac1595bb23751033d247465ff3c7572d9a7049::mine::Config", typeArgs: [ ] as [], reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => Config.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => Config.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => Config.fromBcs( data, ), bcs: Config.bcs, fromJSONField: (field: any) => Config.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => Config.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => Config.fromSuiParsedData( content, ), fetch: async (client: SuiClient, id: string) => Config.fetch( client, id, ), new: ( fields: ConfigFields, ) => { return new Config( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return Config.reified() }

 static phantom( ): PhantomReified<ToTypeStr<Config>> { return phantom(Config.reified( )); } static get p() { return Config.phantom() }

 static get bcs() { return bcs.struct("Config", {

 id: UID.bcs, version: bcs.u8(), bus_count: bcs.u64(), treasury: Locker.bcs, last_difficulty_adjustment: bcs.u64(), total_rewards: bcs.u64(), total_hashes: bcs.u64()

}) };

 static fromFields( fields: Record<string, any> ): Config { return Config.reified( ).new( { id: decodeFromFields(UID.reified(), fields.id), version: decodeFromFields("u8", fields.version), busCount: decodeFromFields("u64", fields.bus_count), treasury: decodeFromFields(Locker.reified(reified.phantom(MINE.reified())), fields.treasury), lastDifficultyAdjustment: decodeFromFields("u64", fields.last_difficulty_adjustment), totalRewards: decodeFromFields("u64", fields.total_rewards), totalHashes: decodeFromFields("u64", fields.total_hashes) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): Config { if (!isConfig(item.type)) { throw new Error("not a Config type");

 }

 return Config.reified( ).new( { id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id), version: decodeFromFieldsWithTypes("u8", item.fields.version), busCount: decodeFromFieldsWithTypes("u64", item.fields.bus_count), treasury: decodeFromFieldsWithTypes(Locker.reified(reified.phantom(MINE.reified())), item.fields.treasury), lastDifficultyAdjustment: decodeFromFieldsWithTypes("u64", item.fields.last_difficulty_adjustment), totalRewards: decodeFromFieldsWithTypes("u64", item.fields.total_rewards), totalHashes: decodeFromFieldsWithTypes("u64", item.fields.total_hashes) } ) }

 static fromBcs( data: Uint8Array ): Config { return Config.fromFields( Config.bcs.parse(data) ) }

 toJSONField() { return {

 id: this.id,version: this.version,busCount: this.busCount.toString(),treasury: this.treasury.toJSONField(),lastDifficultyAdjustment: this.lastDifficultyAdjustment.toString(),totalRewards: this.totalRewards.toString(),totalHashes: this.totalHashes.toString(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): Config { return Config.reified( ).new( { id: decodeFromJSONField(UID.reified(), field.id), version: decodeFromJSONField("u8", field.version), busCount: decodeFromJSONField("u64", field.busCount), treasury: decodeFromJSONField(Locker.reified(reified.phantom(MINE.reified())), field.treasury), lastDifficultyAdjustment: decodeFromJSONField("u64", field.lastDifficultyAdjustment), totalRewards: decodeFromJSONField("u64", field.totalRewards), totalHashes: decodeFromJSONField("u64", field.totalHashes) } ) }

 static fromJSON( json: Record<string, any> ): Config { if (json.$typeName !== Config.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return Config.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): Config { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isConfig(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a Config object`); } return Config.fromFieldsWithTypes( content ); }

 static async fetch( client: SuiClient, id: string ): Promise<Config> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching Config object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isConfig(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a Config object`); }
 return Config.fromBcs( fromB64(res.data.bcs.bcsBytes) ); }

 }

/* ============================== MINE =============================== */

export function isMINE(type: string): boolean { type = compressSuiType(type); return type === "0x9cde6fd22c9518820644dd1350ac1595bb23751033d247465ff3c7572d9a7049::mine::MINE"; }

export interface MINEFields { dummyField: ToField<"bool"> }

export type MINEReified = Reified< MINE, MINEFields >;

export class MINE implements StructClass { static readonly $typeName = "0x9cde6fd22c9518820644dd1350ac1595bb23751033d247465ff3c7572d9a7049::mine::MINE"; static readonly $numTypeParams = 0;

 readonly $typeName = MINE.$typeName;

 readonly $fullTypeName: "0x9cde6fd22c9518820644dd1350ac1595bb23751033d247465ff3c7572d9a7049::mine::MINE";

 readonly $typeArgs: [];

 readonly dummyField: ToField<"bool">

 private constructor(typeArgs: [], fields: MINEFields, ) { this.$fullTypeName = composeSuiType( MINE.$typeName, ...typeArgs ) as "0x9cde6fd22c9518820644dd1350ac1595bb23751033d247465ff3c7572d9a7049::mine::MINE"; this.$typeArgs = typeArgs;

 this.dummyField = fields.dummyField; }

 static reified( ): MINEReified { return { typeName: MINE.$typeName, fullTypeName: composeSuiType( MINE.$typeName, ...[] ) as "0x9cde6fd22c9518820644dd1350ac1595bb23751033d247465ff3c7572d9a7049::mine::MINE", typeArgs: [ ] as [], reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => MINE.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => MINE.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => MINE.fromBcs( data, ), bcs: MINE.bcs, fromJSONField: (field: any) => MINE.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => MINE.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => MINE.fromSuiParsedData( content, ), fetch: async (client: SuiClient, id: string) => MINE.fetch( client, id, ), new: ( fields: MINEFields, ) => { return new MINE( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return MINE.reified() }

 static phantom( ): PhantomReified<ToTypeStr<MINE>> { return phantom(MINE.reified( )); } static get p() { return MINE.phantom() }

 static get bcs() { return bcs.struct("MINE", {

 dummy_field: bcs.bool()

}) };

 static fromFields( fields: Record<string, any> ): MINE { return MINE.reified( ).new( { dummyField: decodeFromFields("bool", fields.dummy_field) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): MINE { if (!isMINE(item.type)) { throw new Error("not a MINE type");

 }

 return MINE.reified( ).new( { dummyField: decodeFromFieldsWithTypes("bool", item.fields.dummy_field) } ) }

 static fromBcs( data: Uint8Array ): MINE { return MINE.fromFields( MINE.bcs.parse(data) ) }

 toJSONField() { return {

 dummyField: this.dummyField,

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): MINE { return MINE.reified( ).new( { dummyField: decodeFromJSONField("bool", field.dummyField) } ) }

 static fromJSON( json: Record<string, any> ): MINE { if (json.$typeName !== MINE.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return MINE.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): MINE { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isMINE(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a MINE object`); } return MINE.fromFieldsWithTypes( content ); }

 static async fetch( client: SuiClient, id: string ): Promise<MINE> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching MINE object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isMINE(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a MINE object`); }
 return MINE.fromBcs( fromB64(res.data.bcs.bcsBytes) ); }

 }
