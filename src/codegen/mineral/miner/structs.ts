import * as reified from "../../_framework/reified";
import {UID} from "../../_dependencies/source/0x2/object/structs";
import {PhantomReified, Reified, StructClass, ToField, ToTypeStr, Vector, decodeFromFields, decodeFromFieldsWithTypes, decodeFromJSONField, fieldToJSON, phantom} from "../../_framework/reified";
import {FieldsWithTypes, composeSuiType, compressSuiType} from "../../_framework/util";
import {bcs, fromB64} from "@mysten/bcs";
import {SuiClient, SuiParsedData} from "@mysten/sui.js/client";

/* ============================== Miner =============================== */

export function isMiner(type: string): boolean { type = compressSuiType(type); return type === "0x9cde6fd22c9518820644dd1350ac1595bb23751033d247465ff3c7572d9a7049::miner::Miner"; }

export interface MinerFields { id: ToField<UID>; currentHash: ToField<Vector<"u8">>; totalRewards: ToField<"u64">; totalHashes: ToField<"u64"> }

export type MinerReified = Reified< Miner, MinerFields >;

export class Miner implements StructClass { static readonly $typeName = "0x9cde6fd22c9518820644dd1350ac1595bb23751033d247465ff3c7572d9a7049::miner::Miner"; static readonly $numTypeParams = 0;

 readonly $typeName = Miner.$typeName;

 readonly $fullTypeName: "0x9cde6fd22c9518820644dd1350ac1595bb23751033d247465ff3c7572d9a7049::miner::Miner";

 readonly $typeArgs: [];

 readonly id: ToField<UID>; readonly currentHash: ToField<Vector<"u8">>; readonly totalRewards: ToField<"u64">; readonly totalHashes: ToField<"u64">

 private constructor(typeArgs: [], fields: MinerFields, ) { this.$fullTypeName = composeSuiType( Miner.$typeName, ...typeArgs ) as "0x9cde6fd22c9518820644dd1350ac1595bb23751033d247465ff3c7572d9a7049::miner::Miner"; this.$typeArgs = typeArgs;

 this.id = fields.id;; this.currentHash = fields.currentHash;; this.totalRewards = fields.totalRewards;; this.totalHashes = fields.totalHashes; }

 static reified( ): MinerReified { return { typeName: Miner.$typeName, fullTypeName: composeSuiType( Miner.$typeName, ...[] ) as "0x9cde6fd22c9518820644dd1350ac1595bb23751033d247465ff3c7572d9a7049::miner::Miner", typeArgs: [ ] as [], reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => Miner.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => Miner.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => Miner.fromBcs( data, ), bcs: Miner.bcs, fromJSONField: (field: any) => Miner.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => Miner.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => Miner.fromSuiParsedData( content, ), fetch: async (client: SuiClient, id: string) => Miner.fetch( client, id, ), new: ( fields: MinerFields, ) => { return new Miner( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return Miner.reified() }

 static phantom( ): PhantomReified<ToTypeStr<Miner>> { return phantom(Miner.reified( )); } static get p() { return Miner.phantom() }

 static get bcs() { return bcs.struct("Miner", {

 id: UID.bcs, current_hash: bcs.vector(bcs.u8()), total_rewards: bcs.u64(), total_hashes: bcs.u64()

}) };

 static fromFields( fields: Record<string, any> ): Miner { return Miner.reified( ).new( { id: decodeFromFields(UID.reified(), fields.id), currentHash: decodeFromFields(reified.vector("u8"), fields.current_hash), totalRewards: decodeFromFields("u64", fields.total_rewards), totalHashes: decodeFromFields("u64", fields.total_hashes) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): Miner { if (!isMiner(item.type)) { throw new Error("not a Miner type");

 }

 return Miner.reified( ).new( { id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id), currentHash: decodeFromFieldsWithTypes(reified.vector("u8"), item.fields.current_hash), totalRewards: decodeFromFieldsWithTypes("u64", item.fields.total_rewards), totalHashes: decodeFromFieldsWithTypes("u64", item.fields.total_hashes) } ) }

 static fromBcs( data: Uint8Array ): Miner { return Miner.fromFields( Miner.bcs.parse(data) ) }

 toJSONField() { return {

 id: this.id,currentHash: fieldToJSON<Vector<"u8">>(`vector<u8>`, this.currentHash),totalRewards: this.totalRewards.toString(),totalHashes: this.totalHashes.toString(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): Miner { return Miner.reified( ).new( { id: decodeFromJSONField(UID.reified(), field.id), currentHash: decodeFromJSONField(reified.vector("u8"), field.currentHash), totalRewards: decodeFromJSONField("u64", field.totalRewards), totalHashes: decodeFromJSONField("u64", field.totalHashes) } ) }

 static fromJSON( json: Record<string, any> ): Miner { if (json.$typeName !== Miner.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return Miner.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): Miner { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isMiner(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a Miner object`); } return Miner.fromFieldsWithTypes( content ); }

 static async fetch( client: SuiClient, id: string ): Promise<Miner> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching Miner object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isMiner(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a Miner object`); }
 return Miner.fromBcs( fromB64(res.data.bcs.bcsBytes) ); }

 }
