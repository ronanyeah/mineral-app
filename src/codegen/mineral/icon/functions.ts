import {PUBLISHED_AT} from "..";
import {Transaction} from "@mysten/sui/transactions";

export function getIconUrl( tx: Transaction, ) { return tx.moveCall({ target: `${PUBLISHED_AT}::icon::get_icon_url`, arguments: [ ], }) }
