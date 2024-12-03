import {PhantomReified, Reified, StructClass, ToField, ToTypeStr, decodeFromFields, decodeFromFieldsWithTypes, decodeFromJSONField, phantom} from "../../../../_framework/reified";
import {FieldsWithTypes, composeSuiType, compressSuiType} from "../../../../_framework/util";
import {PKG_V25} from "../index";
import {bcs} from "@mysten/sui/bcs";
import {SuiClient, SuiObjectData, SuiParsedData} from "@mysten/sui/client";
import {fromB64} from "@mysten/sui/utils";

/* ============================== G1 =============================== */

export function isG1(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V25}::bls12381::G1`; }

export interface G1Fields { dummyField: ToField<"bool"> }

export type G1Reified = Reified< G1, G1Fields >;

export class G1 implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V25}::bls12381::G1`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = G1.$typeName; readonly $fullTypeName: `${typeof PKG_V25}::bls12381::G1`; readonly $typeArgs: []; readonly $isPhantom = G1.$isPhantom;

 readonly dummyField: ToField<"bool">

 private constructor(typeArgs: [], fields: G1Fields, ) { this.$fullTypeName = composeSuiType( G1.$typeName, ...typeArgs ) as `${typeof PKG_V25}::bls12381::G1`; this.$typeArgs = typeArgs;

 this.dummyField = fields.dummyField; }

 static reified( ): G1Reified { return { typeName: G1.$typeName, fullTypeName: composeSuiType( G1.$typeName, ...[] ) as `${typeof PKG_V25}::bls12381::G1`, typeArgs: [ ] as [], isPhantom: G1.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => G1.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => G1.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => G1.fromBcs( data, ), bcs: G1.bcs, fromJSONField: (field: any) => G1.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => G1.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => G1.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => G1.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => G1.fetch( client, id, ), new: ( fields: G1Fields, ) => { return new G1( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return G1.reified() }

 static phantom( ): PhantomReified<ToTypeStr<G1>> { return phantom(G1.reified( )); } static get p() { return G1.phantom() }

 static get bcs() { return bcs.struct("G1", {

 dummyField: bcs.bool()

}) };

 static fromFields( fields: Record<string, any> ): G1 { return G1.reified( ).new( { dummyField: decodeFromFields("bool", fields.dummyField) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): G1 { if (!isG1(item.type)) { throw new Error("not a G1 type");

 }

 return G1.reified( ).new( { dummyField: decodeFromFieldsWithTypes("bool", item.fields.dummyField) } ) }

 static fromBcs( data: Uint8Array ): G1 { return G1.fromFields( G1.bcs.parse(data) ) }

 toJSONField() { return {

 dummyField: this.dummyField,

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): G1 { return G1.reified( ).new( { dummyField: decodeFromJSONField("bool", field.dummyField) } ) }

 static fromJSON( json: Record<string, any> ): G1 { if (json.$typeName !== G1.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return G1.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): G1 { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isG1(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a G1 object`); } return G1.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): G1 { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isG1(data.bcs.type)) { throw new Error(`object at is not a G1 object`); }

 return G1.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return G1.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<G1> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching G1 object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isG1(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a G1 object`); }

 return G1.fromSuiObjectData( res.data ); }

 }

/* ============================== G2 =============================== */

export function isG2(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V25}::bls12381::G2`; }

export interface G2Fields { dummyField: ToField<"bool"> }

export type G2Reified = Reified< G2, G2Fields >;

export class G2 implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V25}::bls12381::G2`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = G2.$typeName; readonly $fullTypeName: `${typeof PKG_V25}::bls12381::G2`; readonly $typeArgs: []; readonly $isPhantom = G2.$isPhantom;

 readonly dummyField: ToField<"bool">

 private constructor(typeArgs: [], fields: G2Fields, ) { this.$fullTypeName = composeSuiType( G2.$typeName, ...typeArgs ) as `${typeof PKG_V25}::bls12381::G2`; this.$typeArgs = typeArgs;

 this.dummyField = fields.dummyField; }

 static reified( ): G2Reified { return { typeName: G2.$typeName, fullTypeName: composeSuiType( G2.$typeName, ...[] ) as `${typeof PKG_V25}::bls12381::G2`, typeArgs: [ ] as [], isPhantom: G2.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => G2.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => G2.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => G2.fromBcs( data, ), bcs: G2.bcs, fromJSONField: (field: any) => G2.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => G2.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => G2.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => G2.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => G2.fetch( client, id, ), new: ( fields: G2Fields, ) => { return new G2( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return G2.reified() }

 static phantom( ): PhantomReified<ToTypeStr<G2>> { return phantom(G2.reified( )); } static get p() { return G2.phantom() }

 static get bcs() { return bcs.struct("G2", {

 dummyField: bcs.bool()

}) };

 static fromFields( fields: Record<string, any> ): G2 { return G2.reified( ).new( { dummyField: decodeFromFields("bool", fields.dummyField) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): G2 { if (!isG2(item.type)) { throw new Error("not a G2 type");

 }

 return G2.reified( ).new( { dummyField: decodeFromFieldsWithTypes("bool", item.fields.dummyField) } ) }

 static fromBcs( data: Uint8Array ): G2 { return G2.fromFields( G2.bcs.parse(data) ) }

 toJSONField() { return {

 dummyField: this.dummyField,

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): G2 { return G2.reified( ).new( { dummyField: decodeFromJSONField("bool", field.dummyField) } ) }

 static fromJSON( json: Record<string, any> ): G2 { if (json.$typeName !== G2.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return G2.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): G2 { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isG2(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a G2 object`); } return G2.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): G2 { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isG2(data.bcs.type)) { throw new Error(`object at is not a G2 object`); }

 return G2.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return G2.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<G2> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching G2 object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isG2(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a G2 object`); }

 return G2.fromSuiObjectData( res.data ); }

 }

/* ============================== GT =============================== */

export function isGT(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V25}::bls12381::GT`; }

export interface GTFields { dummyField: ToField<"bool"> }

export type GTReified = Reified< GT, GTFields >;

export class GT implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V25}::bls12381::GT`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = GT.$typeName; readonly $fullTypeName: `${typeof PKG_V25}::bls12381::GT`; readonly $typeArgs: []; readonly $isPhantom = GT.$isPhantom;

 readonly dummyField: ToField<"bool">

 private constructor(typeArgs: [], fields: GTFields, ) { this.$fullTypeName = composeSuiType( GT.$typeName, ...typeArgs ) as `${typeof PKG_V25}::bls12381::GT`; this.$typeArgs = typeArgs;

 this.dummyField = fields.dummyField; }

 static reified( ): GTReified { return { typeName: GT.$typeName, fullTypeName: composeSuiType( GT.$typeName, ...[] ) as `${typeof PKG_V25}::bls12381::GT`, typeArgs: [ ] as [], isPhantom: GT.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => GT.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => GT.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => GT.fromBcs( data, ), bcs: GT.bcs, fromJSONField: (field: any) => GT.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => GT.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => GT.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => GT.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => GT.fetch( client, id, ), new: ( fields: GTFields, ) => { return new GT( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return GT.reified() }

 static phantom( ): PhantomReified<ToTypeStr<GT>> { return phantom(GT.reified( )); } static get p() { return GT.phantom() }

 static get bcs() { return bcs.struct("GT", {

 dummyField: bcs.bool()

}) };

 static fromFields( fields: Record<string, any> ): GT { return GT.reified( ).new( { dummyField: decodeFromFields("bool", fields.dummyField) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): GT { if (!isGT(item.type)) { throw new Error("not a GT type");

 }

 return GT.reified( ).new( { dummyField: decodeFromFieldsWithTypes("bool", item.fields.dummyField) } ) }

 static fromBcs( data: Uint8Array ): GT { return GT.fromFields( GT.bcs.parse(data) ) }

 toJSONField() { return {

 dummyField: this.dummyField,

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): GT { return GT.reified( ).new( { dummyField: decodeFromJSONField("bool", field.dummyField) } ) }

 static fromJSON( json: Record<string, any> ): GT { if (json.$typeName !== GT.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return GT.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): GT { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isGT(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a GT object`); } return GT.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): GT { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isGT(data.bcs.type)) { throw new Error(`object at is not a GT object`); }

 return GT.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return GT.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<GT> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching GT object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isGT(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a GT object`); }

 return GT.fromSuiObjectData( res.data ); }

 }

/* ============================== Scalar =============================== */

export function isScalar(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V25}::bls12381::Scalar`; }

export interface ScalarFields { dummyField: ToField<"bool"> }

export type ScalarReified = Reified< Scalar, ScalarFields >;

export class Scalar implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V25}::bls12381::Scalar`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = Scalar.$typeName; readonly $fullTypeName: `${typeof PKG_V25}::bls12381::Scalar`; readonly $typeArgs: []; readonly $isPhantom = Scalar.$isPhantom;

 readonly dummyField: ToField<"bool">

 private constructor(typeArgs: [], fields: ScalarFields, ) { this.$fullTypeName = composeSuiType( Scalar.$typeName, ...typeArgs ) as `${typeof PKG_V25}::bls12381::Scalar`; this.$typeArgs = typeArgs;

 this.dummyField = fields.dummyField; }

 static reified( ): ScalarReified { return { typeName: Scalar.$typeName, fullTypeName: composeSuiType( Scalar.$typeName, ...[] ) as `${typeof PKG_V25}::bls12381::Scalar`, typeArgs: [ ] as [], isPhantom: Scalar.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => Scalar.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => Scalar.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => Scalar.fromBcs( data, ), bcs: Scalar.bcs, fromJSONField: (field: any) => Scalar.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => Scalar.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => Scalar.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => Scalar.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => Scalar.fetch( client, id, ), new: ( fields: ScalarFields, ) => { return new Scalar( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return Scalar.reified() }

 static phantom( ): PhantomReified<ToTypeStr<Scalar>> { return phantom(Scalar.reified( )); } static get p() { return Scalar.phantom() }

 static get bcs() { return bcs.struct("Scalar", {

 dummyField: bcs.bool()

}) };

 static fromFields( fields: Record<string, any> ): Scalar { return Scalar.reified( ).new( { dummyField: decodeFromFields("bool", fields.dummyField) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): Scalar { if (!isScalar(item.type)) { throw new Error("not a Scalar type");

 }

 return Scalar.reified( ).new( { dummyField: decodeFromFieldsWithTypes("bool", item.fields.dummyField) } ) }

 static fromBcs( data: Uint8Array ): Scalar { return Scalar.fromFields( Scalar.bcs.parse(data) ) }

 toJSONField() { return {

 dummyField: this.dummyField,

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): Scalar { return Scalar.reified( ).new( { dummyField: decodeFromJSONField("bool", field.dummyField) } ) }

 static fromJSON( json: Record<string, any> ): Scalar { if (json.$typeName !== Scalar.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return Scalar.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): Scalar { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isScalar(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a Scalar object`); } return Scalar.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): Scalar { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isScalar(data.bcs.type)) { throw new Error(`object at is not a Scalar object`); }

 return Scalar.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return Scalar.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<Scalar> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching Scalar object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isScalar(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a Scalar object`); }

 return Scalar.fromSuiObjectData( res.data ); }

 }

/* ============================== UncompressedG1 =============================== */

export function isUncompressedG1(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V25}::bls12381::UncompressedG1`; }

export interface UncompressedG1Fields { dummyField: ToField<"bool"> }

export type UncompressedG1Reified = Reified< UncompressedG1, UncompressedG1Fields >;

export class UncompressedG1 implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V25}::bls12381::UncompressedG1`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = UncompressedG1.$typeName; readonly $fullTypeName: `${typeof PKG_V25}::bls12381::UncompressedG1`; readonly $typeArgs: []; readonly $isPhantom = UncompressedG1.$isPhantom;

 readonly dummyField: ToField<"bool">

 private constructor(typeArgs: [], fields: UncompressedG1Fields, ) { this.$fullTypeName = composeSuiType( UncompressedG1.$typeName, ...typeArgs ) as `${typeof PKG_V25}::bls12381::UncompressedG1`; this.$typeArgs = typeArgs;

 this.dummyField = fields.dummyField; }

 static reified( ): UncompressedG1Reified { return { typeName: UncompressedG1.$typeName, fullTypeName: composeSuiType( UncompressedG1.$typeName, ...[] ) as `${typeof PKG_V25}::bls12381::UncompressedG1`, typeArgs: [ ] as [], isPhantom: UncompressedG1.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => UncompressedG1.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => UncompressedG1.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => UncompressedG1.fromBcs( data, ), bcs: UncompressedG1.bcs, fromJSONField: (field: any) => UncompressedG1.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => UncompressedG1.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => UncompressedG1.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => UncompressedG1.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => UncompressedG1.fetch( client, id, ), new: ( fields: UncompressedG1Fields, ) => { return new UncompressedG1( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return UncompressedG1.reified() }

 static phantom( ): PhantomReified<ToTypeStr<UncompressedG1>> { return phantom(UncompressedG1.reified( )); } static get p() { return UncompressedG1.phantom() }

 static get bcs() { return bcs.struct("UncompressedG1", {

 dummyField: bcs.bool()

}) };

 static fromFields( fields: Record<string, any> ): UncompressedG1 { return UncompressedG1.reified( ).new( { dummyField: decodeFromFields("bool", fields.dummyField) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): UncompressedG1 { if (!isUncompressedG1(item.type)) { throw new Error("not a UncompressedG1 type");

 }

 return UncompressedG1.reified( ).new( { dummyField: decodeFromFieldsWithTypes("bool", item.fields.dummyField) } ) }

 static fromBcs( data: Uint8Array ): UncompressedG1 { return UncompressedG1.fromFields( UncompressedG1.bcs.parse(data) ) }

 toJSONField() { return {

 dummyField: this.dummyField,

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): UncompressedG1 { return UncompressedG1.reified( ).new( { dummyField: decodeFromJSONField("bool", field.dummyField) } ) }

 static fromJSON( json: Record<string, any> ): UncompressedG1 { if (json.$typeName !== UncompressedG1.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return UncompressedG1.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): UncompressedG1 { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isUncompressedG1(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a UncompressedG1 object`); } return UncompressedG1.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): UncompressedG1 { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isUncompressedG1(data.bcs.type)) { throw new Error(`object at is not a UncompressedG1 object`); }

 return UncompressedG1.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return UncompressedG1.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<UncompressedG1> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching UncompressedG1 object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isUncompressedG1(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a UncompressedG1 object`); }

 return UncompressedG1.fromSuiObjectData( res.data ); }

 }
