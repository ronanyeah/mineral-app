import * as reified from "../../../../_framework/reified";
import {PhantomReified, Reified, StructClass, ToField, ToTypeStr, decodeFromFields, decodeFromFieldsWithTypes, decodeFromJSONField, fieldToJSON, phantom} from "../../../../_framework/reified";
import {FieldsWithTypes, composeSuiType, compressSuiType} from "../../../../_framework/util";
import {Vector} from "../../../../_framework/vector";
import {PKG_V25} from "../index";
import {UID} from "../object/structs";
import {Versioned} from "../versioned/structs";
import {bcs} from "@mysten/sui/bcs";
import {SuiClient, SuiObjectData, SuiParsedData} from "@mysten/sui/client";
import {fromB64} from "@mysten/sui/utils";

/* ============================== Random =============================== */

export function isRandom(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V25}::random::Random`; }

export interface RandomFields { id: ToField<UID>; inner: ToField<Versioned> }

export type RandomReified = Reified< Random, RandomFields >;

export class Random implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V25}::random::Random`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = Random.$typeName; readonly $fullTypeName: `${typeof PKG_V25}::random::Random`; readonly $typeArgs: []; readonly $isPhantom = Random.$isPhantom;

 readonly id: ToField<UID>; readonly inner: ToField<Versioned>

 private constructor(typeArgs: [], fields: RandomFields, ) { this.$fullTypeName = composeSuiType( Random.$typeName, ...typeArgs ) as `${typeof PKG_V25}::random::Random`; this.$typeArgs = typeArgs;

 this.id = fields.id;; this.inner = fields.inner; }

 static reified( ): RandomReified { return { typeName: Random.$typeName, fullTypeName: composeSuiType( Random.$typeName, ...[] ) as `${typeof PKG_V25}::random::Random`, typeArgs: [ ] as [], isPhantom: Random.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => Random.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => Random.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => Random.fromBcs( data, ), bcs: Random.bcs, fromJSONField: (field: any) => Random.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => Random.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => Random.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => Random.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => Random.fetch( client, id, ), new: ( fields: RandomFields, ) => { return new Random( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return Random.reified() }

 static phantom( ): PhantomReified<ToTypeStr<Random>> { return phantom(Random.reified( )); } static get p() { return Random.phantom() }

 static get bcs() { return bcs.struct("Random", {

 id: UID.bcs, inner: Versioned.bcs

}) };

 static fromFields( fields: Record<string, any> ): Random { return Random.reified( ).new( { id: decodeFromFields(UID.reified(), fields.id), inner: decodeFromFields(Versioned.reified(), fields.inner) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): Random { if (!isRandom(item.type)) { throw new Error("not a Random type");

 }

 return Random.reified( ).new( { id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id), inner: decodeFromFieldsWithTypes(Versioned.reified(), item.fields.inner) } ) }

 static fromBcs( data: Uint8Array ): Random { return Random.fromFields( Random.bcs.parse(data) ) }

 toJSONField() { return {

 id: this.id,inner: this.inner.toJSONField(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): Random { return Random.reified( ).new( { id: decodeFromJSONField(UID.reified(), field.id), inner: decodeFromJSONField(Versioned.reified(), field.inner) } ) }

 static fromJSON( json: Record<string, any> ): Random { if (json.$typeName !== Random.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return Random.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): Random { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isRandom(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a Random object`); } return Random.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): Random { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isRandom(data.bcs.type)) { throw new Error(`object at is not a Random object`); }

 return Random.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return Random.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<Random> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching Random object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isRandom(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a Random object`); }

 return Random.fromSuiObjectData( res.data ); }

 }

/* ============================== RandomGenerator =============================== */

export function isRandomGenerator(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V25}::random::RandomGenerator`; }

export interface RandomGeneratorFields { seed: ToField<Vector<"u8">>; counter: ToField<"u16">; buffer: ToField<Vector<"u8">> }

export type RandomGeneratorReified = Reified< RandomGenerator, RandomGeneratorFields >;

export class RandomGenerator implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V25}::random::RandomGenerator`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = RandomGenerator.$typeName; readonly $fullTypeName: `${typeof PKG_V25}::random::RandomGenerator`; readonly $typeArgs: []; readonly $isPhantom = RandomGenerator.$isPhantom;

 readonly seed: ToField<Vector<"u8">>; readonly counter: ToField<"u16">; readonly buffer: ToField<Vector<"u8">>

 private constructor(typeArgs: [], fields: RandomGeneratorFields, ) { this.$fullTypeName = composeSuiType( RandomGenerator.$typeName, ...typeArgs ) as `${typeof PKG_V25}::random::RandomGenerator`; this.$typeArgs = typeArgs;

 this.seed = fields.seed;; this.counter = fields.counter;; this.buffer = fields.buffer; }

 static reified( ): RandomGeneratorReified { return { typeName: RandomGenerator.$typeName, fullTypeName: composeSuiType( RandomGenerator.$typeName, ...[] ) as `${typeof PKG_V25}::random::RandomGenerator`, typeArgs: [ ] as [], isPhantom: RandomGenerator.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => RandomGenerator.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => RandomGenerator.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => RandomGenerator.fromBcs( data, ), bcs: RandomGenerator.bcs, fromJSONField: (field: any) => RandomGenerator.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => RandomGenerator.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => RandomGenerator.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => RandomGenerator.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => RandomGenerator.fetch( client, id, ), new: ( fields: RandomGeneratorFields, ) => { return new RandomGenerator( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return RandomGenerator.reified() }

 static phantom( ): PhantomReified<ToTypeStr<RandomGenerator>> { return phantom(RandomGenerator.reified( )); } static get p() { return RandomGenerator.phantom() }

 static get bcs() { return bcs.struct("RandomGenerator", {

 seed: bcs.vector(bcs.u8()), counter: bcs.u16(), buffer: bcs.vector(bcs.u8())

}) };

 static fromFields( fields: Record<string, any> ): RandomGenerator { return RandomGenerator.reified( ).new( { seed: decodeFromFields(reified.vector("u8"), fields.seed), counter: decodeFromFields("u16", fields.counter), buffer: decodeFromFields(reified.vector("u8"), fields.buffer) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): RandomGenerator { if (!isRandomGenerator(item.type)) { throw new Error("not a RandomGenerator type");

 }

 return RandomGenerator.reified( ).new( { seed: decodeFromFieldsWithTypes(reified.vector("u8"), item.fields.seed), counter: decodeFromFieldsWithTypes("u16", item.fields.counter), buffer: decodeFromFieldsWithTypes(reified.vector("u8"), item.fields.buffer) } ) }

 static fromBcs( data: Uint8Array ): RandomGenerator { return RandomGenerator.fromFields( RandomGenerator.bcs.parse(data) ) }

 toJSONField() { return {

 seed: fieldToJSON<Vector<"u8">>(`vector<u8>`, this.seed),counter: this.counter,buffer: fieldToJSON<Vector<"u8">>(`vector<u8>`, this.buffer),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): RandomGenerator { return RandomGenerator.reified( ).new( { seed: decodeFromJSONField(reified.vector("u8"), field.seed), counter: decodeFromJSONField("u16", field.counter), buffer: decodeFromJSONField(reified.vector("u8"), field.buffer) } ) }

 static fromJSON( json: Record<string, any> ): RandomGenerator { if (json.$typeName !== RandomGenerator.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return RandomGenerator.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): RandomGenerator { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isRandomGenerator(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a RandomGenerator object`); } return RandomGenerator.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): RandomGenerator { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isRandomGenerator(data.bcs.type)) { throw new Error(`object at is not a RandomGenerator object`); }

 return RandomGenerator.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return RandomGenerator.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<RandomGenerator> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching RandomGenerator object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isRandomGenerator(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a RandomGenerator object`); }

 return RandomGenerator.fromSuiObjectData( res.data ); }

 }

/* ============================== RandomInner =============================== */

export function isRandomInner(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V25}::random::RandomInner`; }

export interface RandomInnerFields { version: ToField<"u64">; epoch: ToField<"u64">; randomnessRound: ToField<"u64">; randomBytes: ToField<Vector<"u8">> }

export type RandomInnerReified = Reified< RandomInner, RandomInnerFields >;

export class RandomInner implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V25}::random::RandomInner`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = RandomInner.$typeName; readonly $fullTypeName: `${typeof PKG_V25}::random::RandomInner`; readonly $typeArgs: []; readonly $isPhantom = RandomInner.$isPhantom;

 readonly version: ToField<"u64">; readonly epoch: ToField<"u64">; readonly randomnessRound: ToField<"u64">; readonly randomBytes: ToField<Vector<"u8">>

 private constructor(typeArgs: [], fields: RandomInnerFields, ) { this.$fullTypeName = composeSuiType( RandomInner.$typeName, ...typeArgs ) as `${typeof PKG_V25}::random::RandomInner`; this.$typeArgs = typeArgs;

 this.version = fields.version;; this.epoch = fields.epoch;; this.randomnessRound = fields.randomnessRound;; this.randomBytes = fields.randomBytes; }

 static reified( ): RandomInnerReified { return { typeName: RandomInner.$typeName, fullTypeName: composeSuiType( RandomInner.$typeName, ...[] ) as `${typeof PKG_V25}::random::RandomInner`, typeArgs: [ ] as [], isPhantom: RandomInner.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => RandomInner.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => RandomInner.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => RandomInner.fromBcs( data, ), bcs: RandomInner.bcs, fromJSONField: (field: any) => RandomInner.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => RandomInner.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => RandomInner.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => RandomInner.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => RandomInner.fetch( client, id, ), new: ( fields: RandomInnerFields, ) => { return new RandomInner( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return RandomInner.reified() }

 static phantom( ): PhantomReified<ToTypeStr<RandomInner>> { return phantom(RandomInner.reified( )); } static get p() { return RandomInner.phantom() }

 static get bcs() { return bcs.struct("RandomInner", {

 version: bcs.u64(), epoch: bcs.u64(), randomnessRound: bcs.u64(), randomBytes: bcs.vector(bcs.u8())

}) };

 static fromFields( fields: Record<string, any> ): RandomInner { return RandomInner.reified( ).new( { version: decodeFromFields("u64", fields.version), epoch: decodeFromFields("u64", fields.epoch), randomnessRound: decodeFromFields("u64", fields.randomnessRound), randomBytes: decodeFromFields(reified.vector("u8"), fields.randomBytes) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): RandomInner { if (!isRandomInner(item.type)) { throw new Error("not a RandomInner type");

 }

 return RandomInner.reified( ).new( { version: decodeFromFieldsWithTypes("u64", item.fields.version), epoch: decodeFromFieldsWithTypes("u64", item.fields.epoch), randomnessRound: decodeFromFieldsWithTypes("u64", item.fields.randomnessRound), randomBytes: decodeFromFieldsWithTypes(reified.vector("u8"), item.fields.randomBytes) } ) }

 static fromBcs( data: Uint8Array ): RandomInner { return RandomInner.fromFields( RandomInner.bcs.parse(data) ) }

 toJSONField() { return {

 version: this.version.toString(),epoch: this.epoch.toString(),randomnessRound: this.randomnessRound.toString(),randomBytes: fieldToJSON<Vector<"u8">>(`vector<u8>`, this.randomBytes),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): RandomInner { return RandomInner.reified( ).new( { version: decodeFromJSONField("u64", field.version), epoch: decodeFromJSONField("u64", field.epoch), randomnessRound: decodeFromJSONField("u64", field.randomnessRound), randomBytes: decodeFromJSONField(reified.vector("u8"), field.randomBytes) } ) }

 static fromJSON( json: Record<string, any> ): RandomInner { if (json.$typeName !== RandomInner.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return RandomInner.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): RandomInner { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isRandomInner(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a RandomInner object`); } return RandomInner.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): RandomInner { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isRandomInner(data.bcs.type)) { throw new Error(`object at is not a RandomInner object`); }

 return RandomInner.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return RandomInner.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<RandomInner> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching RandomInner object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isRandomInner(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a RandomInner object`); }

 return RandomInner.fromSuiObjectData( res.data ); }

 }
