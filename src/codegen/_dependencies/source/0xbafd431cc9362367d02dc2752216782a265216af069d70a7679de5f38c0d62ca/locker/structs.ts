import {PhantomReified, PhantomToTypeStr, PhantomTypeArgument, Reified, StructClass, ToField, ToPhantomTypeArgument, ToTypeStr, assertFieldsWithTypesArgsMatch, assertReifiedTypeArgsMatch, decodeFromFields, decodeFromFieldsWithTypes, decodeFromJSONField, extractType, phantom} from "../../../../_framework/reified";
import {FieldsWithTypes, composeSuiType, compressSuiType, parseTypeName} from "../../../../_framework/util";
import {PKG_V1} from "../index";
import {TimeLockedBalance} from "../time-locked-balance/structs";
import {bcs} from "@mysten/sui/bcs";
import {SuiClient, SuiParsedData} from "@mysten/sui/client";
import {fromB64} from "@mysten/sui/utils";

/* ============================== Locker =============================== */

export function isLocker(type: string): boolean { type = compressSuiType(type); return type.startsWith(`${PKG_V1}::locker::Locker` + '<'); }

export interface LockerFields<T extends PhantomTypeArgument> { balance: ToField<TimeLockedBalance<T>> }

export type LockerReified<T extends PhantomTypeArgument> = Reified< Locker<T>, LockerFields<T> >;

export class Locker<T extends PhantomTypeArgument> implements StructClass { static readonly $typeName = `${PKG_V1}::locker::Locker`; static readonly $numTypeParams = 1; static readonly $isPhantom = [true,] as const;

 readonly $typeName = Locker.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::locker::Locker<${PhantomToTypeStr<T>}>`; readonly $typeArgs: [PhantomToTypeStr<T>]; readonly $isPhantom = Locker.$isPhantom;

 readonly balance: ToField<TimeLockedBalance<T>>

 private constructor(typeArgs: [PhantomToTypeStr<T>], fields: LockerFields<T>, ) { this.$fullTypeName = composeSuiType( Locker.$typeName, ...typeArgs ) as `${typeof PKG_V1}::locker::Locker<${PhantomToTypeStr<T>}>`; this.$typeArgs = typeArgs;

 this.balance = fields.balance; }

 static reified<T extends PhantomReified<PhantomTypeArgument>>( T: T ): LockerReified<ToPhantomTypeArgument<T>> { return { typeName: Locker.$typeName, fullTypeName: composeSuiType( Locker.$typeName, ...[extractType(T)] ) as `${typeof PKG_V1}::locker::Locker<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}>`, typeArgs: [ extractType(T) ] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>], isPhantom: Locker.$isPhantom, reifiedTypeArgs: [T], fromFields: (fields: Record<string, any>) => Locker.fromFields( T, fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => Locker.fromFieldsWithTypes( T, item, ), fromBcs: (data: Uint8Array) => Locker.fromBcs( T, data, ), bcs: Locker.bcs, fromJSONField: (field: any) => Locker.fromJSONField( T, field, ), fromJSON: (json: Record<string, any>) => Locker.fromJSON( T, json, ), fromSuiParsedData: (content: SuiParsedData) => Locker.fromSuiParsedData( T, content, ), fetch: async (client: SuiClient, id: string) => Locker.fetch( client, T, id, ), new: ( fields: LockerFields<ToPhantomTypeArgument<T>>, ) => { return new Locker( [extractType(T)], fields ) }, kind: "StructClassReified", } }

 static get r() { return Locker.reified }

 static phantom<T extends PhantomReified<PhantomTypeArgument>>( T: T ): PhantomReified<ToTypeStr<Locker<ToPhantomTypeArgument<T>>>> { return phantom(Locker.reified( T )); } static get p() { return Locker.phantom }

 static get bcs() { return bcs.struct("Locker", {

 balance: TimeLockedBalance.bcs

}) };

 static fromFields<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, fields: Record<string, any> ): Locker<ToPhantomTypeArgument<T>> { return Locker.reified( typeArg, ).new( { balance: decodeFromFields(TimeLockedBalance.reified(typeArg), fields.balance) } ) }

 static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, item: FieldsWithTypes ): Locker<ToPhantomTypeArgument<T>> { if (!isLocker(item.type)) { throw new Error("not a Locker type");

 } assertFieldsWithTypesArgsMatch(item, [typeArg]);

 return Locker.reified( typeArg, ).new( { balance: decodeFromFieldsWithTypes(TimeLockedBalance.reified(typeArg), item.fields.balance) } ) }

 static fromBcs<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, data: Uint8Array ): Locker<ToPhantomTypeArgument<T>> { return Locker.fromFields( typeArg, Locker.bcs.parse(data) ) }

 toJSONField() { return {

 balance: this.balance.toJSONField(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, field: any ): Locker<ToPhantomTypeArgument<T>> { return Locker.reified( typeArg, ).new( { balance: decodeFromJSONField(TimeLockedBalance.reified(typeArg), field.balance) } ) }

 static fromJSON<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, json: Record<string, any> ): Locker<ToPhantomTypeArgument<T>> { if (json.$typeName !== Locker.$typeName) { throw new Error("not a WithTwoGenerics json object") }; assertReifiedTypeArgsMatch( composeSuiType(Locker.$typeName, extractType(typeArg)), json.$typeArgs, [typeArg], )

 return Locker.fromJSONField( typeArg, json, ) }

 static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>>( typeArg: T, content: SuiParsedData ): Locker<ToPhantomTypeArgument<T>> { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isLocker(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a Locker object`); } return Locker.fromFieldsWithTypes( typeArg, content ); }

 static async fetch<T extends PhantomReified<PhantomTypeArgument>>( client: SuiClient, typeArg: T, id: string ): Promise<Locker<ToPhantomTypeArgument<T>>> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching Locker object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isLocker(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a Locker object`); }

 const gotTypeArgs = parseTypeName(res.data.bcs.type).typeArgs; if (gotTypeArgs.length !== 1) { throw new Error(`type argument mismatch: expected 1 type argument but got '${gotTypeArgs.length}'`); }; const gotTypeArg = compressSuiType(gotTypeArgs[0]); const expectedTypeArg = compressSuiType(extractType(typeArg)); if (gotTypeArg !== compressSuiType(extractType(typeArg))) { throw new Error(`type argument mismatch: expected '${expectedTypeArg}' but got '${gotTypeArg}'`); };

 return Locker.fromBcs( typeArg, fromB64(res.data.bcs.bcsBytes) ); }

 }
