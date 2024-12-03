import * as reified from "../../../../_framework/reified";
import {PhantomReified, PhantomToTypeStr, PhantomTypeArgument, Reified, StructClass, ToField, ToPhantomTypeArgument, ToTypeStr, assertFieldsWithTypesArgsMatch, assertReifiedTypeArgsMatch, decodeFromFields, decodeFromFieldsWithTypes, decodeFromJSONField, extractType, fieldToJSON, phantom} from "../../../../_framework/reified";
import {FieldsWithTypes, composeSuiType, compressSuiType, parseTypeName} from "../../../../_framework/util";
import {Vector} from "../../../../_framework/vector";
import {PKG_V25} from "../index";
import {bcs} from "@mysten/sui/bcs";
import {SuiClient, SuiObjectData, SuiParsedData} from "@mysten/sui/client";
import {fromB64} from "@mysten/sui/utils";

/* ============================== Element =============================== */

export function isElement(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V25}::group_ops::Element` + '<'); }

export interface ElementFields<T extends PhantomTypeArgument> { bytes: ToField<Vector<"u8">> }

export type ElementReified<T extends PhantomTypeArgument> = Reified< Element<T>, ElementFields<T> >;

export class Element<T extends PhantomTypeArgument> implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V25}::group_ops::Element`; static readonly $numTypeParams = 1; static readonly $isPhantom = [true,] as const;

 readonly $typeName = Element.$typeName; readonly $fullTypeName: `${typeof PKG_V25}::group_ops::Element<${PhantomToTypeStr<T>}>`; readonly $typeArgs: [PhantomToTypeStr<T>]; readonly $isPhantom = Element.$isPhantom;

 readonly bytes: ToField<Vector<"u8">>

 private constructor(typeArgs: [PhantomToTypeStr<T>], fields: ElementFields<T>, ) { this.$fullTypeName = composeSuiType( Element.$typeName, ...typeArgs ) as `${typeof PKG_V25}::group_ops::Element<${PhantomToTypeStr<T>}>`; this.$typeArgs = typeArgs;

 this.bytes = fields.bytes; }

 static reified<T extends PhantomReified<PhantomTypeArgument>>( T: T ): ElementReified<ToPhantomTypeArgument<T>> { return { typeName: Element.$typeName, fullTypeName: composeSuiType( Element.$typeName, ...[extractType(T)] ) as `${typeof PKG_V25}::group_ops::Element<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}>`, typeArgs: [ extractType(T) ] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>], isPhantom: Element.$isPhantom, reifiedTypeArgs: [T], fromFields: (fields: Record<string, any>) => Element.fromFields( T, fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => Element.fromFieldsWithTypes( T, item, ), fromBcs: (data: Uint8Array) => Element.fromBcs( T, data, ), bcs: Element.bcs, fromJSONField: (field: any) => Element.fromJSONField( T, field, ), fromJSON: (json: Record<string, any>) => Element.fromJSON( T, json, ), fromSuiParsedData: (content: SuiParsedData) => Element.fromSuiParsedData( T, content, ), fromSuiObjectData: (content: SuiObjectData) => Element.fromSuiObjectData( T, content, ), fetch: async (client: SuiClient, id: string) => Element.fetch( client, T, id, ), new: ( fields: ElementFields<ToPhantomTypeArgument<T>>, ) => { return new Element( [extractType(T)], fields ) }, kind: "StructClassReified", } }

 static get r() { return Element.reified }

 static phantom<T extends PhantomReified<PhantomTypeArgument>>( T: T ): PhantomReified<ToTypeStr<Element<ToPhantomTypeArgument<T>>>> { return phantom(Element.reified( T )); } static get p() { return Element.phantom }

 static get bcs() { return bcs.struct("Element", {

 bytes: bcs.vector(bcs.u8())

}) };

 static fromFields<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, fields: Record<string, any> ): Element<ToPhantomTypeArgument<T>> { return Element.reified( typeArg, ).new( { bytes: decodeFromFields(reified.vector("u8"), fields.bytes) } ) }

 static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, item: FieldsWithTypes ): Element<ToPhantomTypeArgument<T>> { if (!isElement(item.type)) { throw new Error("not a Element type");

 } assertFieldsWithTypesArgsMatch(item, [typeArg]);

 return Element.reified( typeArg, ).new( { bytes: decodeFromFieldsWithTypes(reified.vector("u8"), item.fields.bytes) } ) }

 static fromBcs<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, data: Uint8Array ): Element<ToPhantomTypeArgument<T>> { return Element.fromFields( typeArg, Element.bcs.parse(data) ) }

 toJSONField() { return {

 bytes: fieldToJSON<Vector<"u8">>(`vector<u8>`, this.bytes),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, field: any ): Element<ToPhantomTypeArgument<T>> { return Element.reified( typeArg, ).new( { bytes: decodeFromJSONField(reified.vector("u8"), field.bytes) } ) }

 static fromJSON<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, json: Record<string, any> ): Element<ToPhantomTypeArgument<T>> { if (json.$typeName !== Element.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(Element.$typeName, extractType(typeArg)), json.$typeArgs, [typeArg], )

 return Element.fromJSONField( typeArg, json, ) }

 static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, content: SuiParsedData ): Element<ToPhantomTypeArgument<T>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isElement(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a Element object`); } return Element.fromFieldsWithTypes( typeArg, content ); }

 static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, data: SuiObjectData ): Element<ToPhantomTypeArgument<T>> { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isElement(data.bcs.type)) { throw new Error(`object at is not a Element object`); }

 const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs; if (gotTypeArgs.length !== 1) { throw new Error(`type argument mismatch: expected 1 type argument but got '${gotTypeArgs.length}'`); }; const gotTypeArg = compressSuiType(gotTypeArgs[0]); const expectedTypeArg = compressSuiType(extractType(typeArg)); if (gotTypeArg !== compressSuiType(extractType(typeArg))) { throw new Error(`type argument mismatch: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); };

 return Element.fromBcs( typeArg, fromB64(data.bcs.bcsBytes) ); } if (data.content) { return Element.fromSuiParsedData( typeArg, data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch<T extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArg: T, id: string ): Promise<Element<ToPhantomTypeArgument<T>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching Element object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isElement(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a Element object`); }

 return Element.fromSuiObjectData( typeArg, res.data ); }

 }
