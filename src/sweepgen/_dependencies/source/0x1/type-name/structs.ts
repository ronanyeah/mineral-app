import {PhantomReified, Reified, StructClass, ToField, ToTypeStr, decodeFromFields, decodeFromFieldsWithTypes, decodeFromJSONField, phantom} from "../../../../_framework/reified";
import {FieldsWithTypes, composeSuiType, compressSuiType} from "../../../../_framework/util";
import {String} from "../ascii/structs";
import {PKG_V12} from "../index";
import {bcs} from "@mysten/sui/bcs";
import {SuiClient, SuiObjectData, SuiParsedData} from "@mysten/sui/client";
import {fromB64} from "@mysten/sui/utils";

/* ============================== TypeName =============================== */

export function isTypeName(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V12}::type_name::TypeName`; }

export interface TypeNameFields { name: ToField<String> }

export type TypeNameReified = Reified< TypeName, TypeNameFields >;

export class TypeName implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V12}::type_name::TypeName`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = TypeName.$typeName; readonly $fullTypeName: `${typeof PKG_V12}::type_name::TypeName`; readonly $typeArgs: []; readonly $isPhantom = TypeName.$isPhantom;

 readonly name: ToField<String>

 private constructor(typeArgs: [], fields: TypeNameFields, ) { this.$fullTypeName = composeSuiType( TypeName.$typeName, ...typeArgs ) as `${typeof PKG_V12}::type_name::TypeName`; this.$typeArgs = typeArgs;

 this.name = fields.name; }

 static reified( ): TypeNameReified { return { typeName: TypeName.$typeName, fullTypeName: composeSuiType( TypeName.$typeName, ...[] ) as `${typeof PKG_V12}::type_name::TypeName`, typeArgs: [ ] as [], isPhantom: TypeName.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => TypeName.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => TypeName.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => TypeName.fromBcs( data, ), bcs: TypeName.bcs, fromJSONField: (field: any) => TypeName.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => TypeName.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => TypeName.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => TypeName.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => TypeName.fetch( client, id, ), new: ( fields: TypeNameFields, ) => { return new TypeName( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return TypeName.reified() }

 static phantom( ): PhantomReified<ToTypeStr<TypeName>> { return phantom(TypeName.reified( )); } static get p() { return TypeName.phantom() }

 static get bcs() { return bcs.struct("TypeName", {

 name: String.bcs

}) };

 static fromFields( fields: Record<string, any> ): TypeName { return TypeName.reified( ).new( { name: decodeFromFields(String.reified(), fields.name) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): TypeName { if (!isTypeName(item.type)) { throw new Error("not a TypeName type");

 }

 return TypeName.reified( ).new( { name: decodeFromFieldsWithTypes(String.reified(), item.fields.name) } ) }

 static fromBcs( data: Uint8Array ): TypeName { return TypeName.fromFields( TypeName.bcs.parse(data) ) }

 toJSONField() { return {

 name: this.name,

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): TypeName { return TypeName.reified( ).new( { name: decodeFromJSONField(String.reified(), field.name) } ) }

 static fromJSON( json: Record<string, any> ): TypeName { if (json.$typeName !== TypeName.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return TypeName.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): TypeName { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isTypeName(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a TypeName object`); } return TypeName.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): TypeName { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isTypeName(data.bcs.type)) { throw new Error(`object at is not a TypeName object`); }

 return TypeName.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return TypeName.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<TypeName> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching TypeName object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isTypeName(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a TypeName object`); }

 return TypeName.fromSuiObjectData( res.data ); }

 }
