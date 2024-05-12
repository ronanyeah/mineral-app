import * as mine from "./mine/structs";
import * as miner from "./miner/structs";
import {StructClassLoader} from "../_framework/loader";

export function registerClasses(loader: StructClassLoader) { loader.register(miner.Miner);
loader.register(mine.AdminCap);
loader.register(mine.Bus);
loader.register(mine.Config);
loader.register(mine.MINE);
 }
