import {PhantomReified, Reified, StructClass, ToField, ToTypeStr, decodeFromFields, decodeFromFieldsWithTypes, decodeFromJSONField, phantom} from "../../../../_framework/reified";
import {FieldsWithTypes, composeSuiType, compressSuiType} from "../../../../_framework/util";
import {PKG_V25} from "../index";
import {UID} from "../object/structs";
import {bcs} from "@mysten/sui/bcs";
import {SuiClient, SuiObjectData, SuiParsedData} from "@mysten/sui/client";
import {fromB64} from "@mysten/sui/utils";

/* ============================== ObjectBag =============================== */

export function isObjectBag(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V25}::object_bag::ObjectBag`; }

export interface ObjectBagFields { id: ToField<UID>; size: ToField<"u64"> }

export type ObjectBagReified = Reified< ObjectBag, ObjectBagFields >;

export class ObjectBag implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V25}::object_bag::ObjectBag`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = ObjectBag.$typeName; readonly $fullTypeName: `${typeof PKG_V25}::object_bag::ObjectBag`; readonly $typeArgs: []; readonly $isPhantom = ObjectBag.$isPhantom;

 readonly id: ToField<UID>; readonly size: ToField<"u64">

 private constructor(typeArgs: [], fields: ObjectBagFields, ) { this.$fullTypeName = composeSuiType( ObjectBag.$typeName, ...typeArgs ) as `${typeof PKG_V25}::object_bag::ObjectBag`; this.$typeArgs = typeArgs;

 this.id = fields.id;; this.size = fields.size; }

 static reified( ): ObjectBagReified { return { typeName: ObjectBag.$typeName, fullTypeName: composeSuiType( ObjectBag.$typeName, ...[] ) as `${typeof PKG_V25}::object_bag::ObjectBag`, typeArgs: [ ] as [], isPhantom: ObjectBag.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => ObjectBag.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => ObjectBag.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => ObjectBag.fromBcs( data, ), bcs: ObjectBag.bcs, fromJSONField: (field: any) => ObjectBag.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => ObjectBag.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => ObjectBag.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => ObjectBag.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => ObjectBag.fetch( client, id, ), new: ( fields: ObjectBagFields, ) => { return new ObjectBag( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return ObjectBag.reified() }

 static phantom( ): PhantomReified<ToTypeStr<ObjectBag>> { return phantom(ObjectBag.reified( )); } static get p() { return ObjectBag.phantom() }

 static get bcs() { return bcs.struct("ObjectBag", {

 id: UID.bcs, size: bcs.u64()

}) };

 static fromFields( fields: Record<string, any> ): ObjectBag { return ObjectBag.reified( ).new( { id: decodeFromFields(UID.reified(), fields.id), size: decodeFromFields("u64", fields.size) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): ObjectBag { if (!isObjectBag(item.type)) { throw new Error("not a ObjectBag type");

 }

 return ObjectBag.reified( ).new( { id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id), size: decodeFromFieldsWithTypes("u64", item.fields.size) } ) }

 static fromBcs( data: Uint8Array ): ObjectBag { return ObjectBag.fromFields( ObjectBag.bcs.parse(data) ) }

 toJSONField() { return {

 id: this.id,size: this.size.toString(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): ObjectBag { return ObjectBag.reified( ).new( { id: decodeFromJSONField(UID.reified(), field.id), size: decodeFromJSONField("u64", field.size) } ) }

 static fromJSON( json: Record<string, any> ): ObjectBag { if (json.$typeName !== ObjectBag.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return ObjectBag.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): ObjectBag { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isObjectBag(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a ObjectBag object`); } return ObjectBag.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): ObjectBag { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isObjectBag(data.bcs.type)) { throw new Error(`object at is not a ObjectBag object`); }

 return ObjectBag.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return ObjectBag.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<ObjectBag> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching ObjectBag object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isObjectBag(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a ObjectBag object`); }

 return ObjectBag.fromSuiObjectData( res.data ); }

 }
