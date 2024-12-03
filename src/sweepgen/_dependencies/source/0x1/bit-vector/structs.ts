import * as reified from "../../../../_framework/reified";
import {PhantomReified, Reified, StructClass, ToField, ToTypeStr, decodeFromFields, decodeFromFieldsWithTypes, decodeFromJSONField, fieldToJSON, phantom} from "../../../../_framework/reified";
import {FieldsWithTypes, composeSuiType, compressSuiType} from "../../../../_framework/util";
import {Vector} from "../../../../_framework/vector";
import {PKG_V12} from "../index";
import {bcs} from "@mysten/sui/bcs";
import {SuiClient, SuiObjectData, SuiParsedData} from "@mysten/sui/client";
import {fromB64} from "@mysten/sui/utils";

/* ============================== BitVector =============================== */

export function isBitVector(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V12}::bit_vector::BitVector`; }

export interface BitVectorFields { length: ToField<"u64">; bitField: ToField<Vector<"bool">> }

export type BitVectorReified = Reified< BitVector, BitVectorFields >;

export class BitVector implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V12}::bit_vector::BitVector`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = BitVector.$typeName; readonly $fullTypeName: `${typeof PKG_V12}::bit_vector::BitVector`; readonly $typeArgs: []; readonly $isPhantom = BitVector.$isPhantom;

 readonly length: ToField<"u64">; readonly bitField: ToField<Vector<"bool">>

 private constructor(typeArgs: [], fields: BitVectorFields, ) { this.$fullTypeName = composeSuiType( BitVector.$typeName, ...typeArgs ) as `${typeof PKG_V12}::bit_vector::BitVector`; this.$typeArgs = typeArgs;

 this.length = fields.length;; this.bitField = fields.bitField; }

 static reified( ): BitVectorReified { return { typeName: BitVector.$typeName, fullTypeName: composeSuiType( BitVector.$typeName, ...[] ) as `${typeof PKG_V12}::bit_vector::BitVector`, typeArgs: [ ] as [], isPhantom: BitVector.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => BitVector.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => BitVector.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => BitVector.fromBcs( data, ), bcs: BitVector.bcs, fromJSONField: (field: any) => BitVector.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => BitVector.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => BitVector.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => BitVector.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => BitVector.fetch( client, id, ), new: ( fields: BitVectorFields, ) => { return new BitVector( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return BitVector.reified() }

 static phantom( ): PhantomReified<ToTypeStr<BitVector>> { return phantom(BitVector.reified( )); } static get p() { return BitVector.phantom() }

 static get bcs() { return bcs.struct("BitVector", {

 length: bcs.u64(), bitField: bcs.vector(bcs.bool())

}) };

 static fromFields( fields: Record<string, any> ): BitVector { return BitVector.reified( ).new( { length: decodeFromFields("u64", fields.length), bitField: decodeFromFields(reified.vector("bool"), fields.bitField) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): BitVector { if (!isBitVector(item.type)) { throw new Error("not a BitVector type");

 }

 return BitVector.reified( ).new( { length: decodeFromFieldsWithTypes("u64", item.fields.length), bitField: decodeFromFieldsWithTypes(reified.vector("bool"), item.fields.bitField) } ) }

 static fromBcs( data: Uint8Array ): BitVector { return BitVector.fromFields( BitVector.bcs.parse(data) ) }

 toJSONField() { return {

 length: this.length.toString(),bitField: fieldToJSON<Vector<"bool">>(`vector<bool>`, this.bitField),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): BitVector { return BitVector.reified( ).new( { length: decodeFromJSONField("u64", field.length), bitField: decodeFromJSONField(reified.vector("bool"), field.bitField) } ) }

 static fromJSON( json: Record<string, any> ): BitVector { if (json.$typeName !== BitVector.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return BitVector.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): BitVector { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isBitVector(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a BitVector object`); } return BitVector.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): BitVector { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isBitVector(data.bcs.type)) { throw new Error(`object at is not a BitVector object`); }

 return BitVector.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return BitVector.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<BitVector> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching BitVector object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isBitVector(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a BitVector object`); }

 return BitVector.fromSuiObjectData( res.data ); }

 }
