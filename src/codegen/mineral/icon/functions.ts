import {PUBLISHED_AT} from "..";
import {TransactionBlock} from "@mysten/sui.js/transactions";

export function getIconUrl( txb: TransactionBlock, ) { return txb.moveCall({ target: `${PUBLISHED_AT}::icon::get_icon_url`, arguments: [ ], }) }
