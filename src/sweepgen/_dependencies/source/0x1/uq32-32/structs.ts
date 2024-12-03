import {PhantomReified, Reified, StructClass, ToField, ToTypeStr, decodeFromFields, decodeFromFieldsWithTypes, decodeFromJSONField, phantom} from "../../../../_framework/reified";
import {FieldsWithTypes, composeSuiType, compressSuiType} from "../../../../_framework/util";
import {PKG_V12} from "../index";
import {bcs} from "@mysten/sui/bcs";
import {SuiClient, SuiObjectData, SuiParsedData} from "@mysten/sui/client";
import {fromB64} from "@mysten/sui/utils";

/* ============================== UQ32_32 =============================== */

export function isUQ32_32(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V12}::uq32_32::UQ32_32`; }

export interface UQ32_32Fields { pos0: ToField<"u64"> }

export type UQ32_32Reified = Reified< UQ32_32, UQ32_32Fields >;

export class UQ32_32 implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V12}::uq32_32::UQ32_32`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = UQ32_32.$typeName; readonly $fullTypeName: `${typeof PKG_V12}::uq32_32::UQ32_32`; readonly $typeArgs: []; readonly $isPhantom = UQ32_32.$isPhantom;

 readonly pos0: ToField<"u64">

 private constructor(typeArgs: [], fields: UQ32_32Fields, ) { this.$fullTypeName = composeSuiType( UQ32_32.$typeName, ...typeArgs ) as `${typeof PKG_V12}::uq32_32::UQ32_32`; this.$typeArgs = typeArgs;

 this.pos0 = fields.pos0; }

 static reified( ): UQ32_32Reified { return { typeName: UQ32_32.$typeName, fullTypeName: composeSuiType( UQ32_32.$typeName, ...[] ) as `${typeof PKG_V12}::uq32_32::UQ32_32`, typeArgs: [ ] as [], isPhantom: UQ32_32.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => UQ32_32.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => UQ32_32.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => UQ32_32.fromBcs( data, ), bcs: UQ32_32.bcs, fromJSONField: (field: any) => UQ32_32.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => UQ32_32.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => UQ32_32.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => UQ32_32.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => UQ32_32.fetch( client, id, ), new: ( fields: UQ32_32Fields, ) => { return new UQ32_32( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return UQ32_32.reified() }

 static phantom( ): PhantomReified<ToTypeStr<UQ32_32>> { return phantom(UQ32_32.reified( )); } static get p() { return UQ32_32.phantom() }

 static get bcs() { return bcs.struct("UQ32_32", {

 pos0: bcs.u64()

}) };

 static fromFields( fields: Record<string, any> ): UQ32_32 { return UQ32_32.reified( ).new( { pos0: decodeFromFields("u64", fields.pos0) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): UQ32_32 { if (!isUQ32_32(item.type)) { throw new Error("not a UQ32_32 type");

 }

 return UQ32_32.reified( ).new( { pos0: decodeFromFieldsWithTypes("u64", item.fields.pos0) } ) }

 static fromBcs( data: Uint8Array ): UQ32_32 { return UQ32_32.fromFields( UQ32_32.bcs.parse(data) ) }

 toJSONField() { return {

 pos0: this.pos0.toString(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): UQ32_32 { return UQ32_32.reified( ).new( { pos0: decodeFromJSONField("u64", field.pos0) } ) }

 static fromJSON( json: Record<string, any> ): UQ32_32 { if (json.$typeName !== UQ32_32.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return UQ32_32.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): UQ32_32 { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isUQ32_32(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a UQ32_32 object`); } return UQ32_32.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): UQ32_32 { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isUQ32_32(data.bcs.type)) { throw new Error(`object at is not a UQ32_32 object`); }

 return UQ32_32.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return UQ32_32.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<UQ32_32> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching UQ32_32 object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isUQ32_32(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a UQ32_32 object`); }

 return UQ32_32.fromSuiObjectData( res.data ); }

 }
