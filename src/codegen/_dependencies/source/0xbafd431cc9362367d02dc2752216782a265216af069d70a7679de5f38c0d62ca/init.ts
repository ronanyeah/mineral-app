import * as locker from "./locker/structs";
import * as timeLockedBalance from "./time-locked-balance/structs";
import {StructClassLoader} from "../../../_framework/loader";

export function registerClasses(loader: StructClassLoader) { loader.register(timeLockedBalance.TimeLockedBalance);
loader.register(locker.Locker);
 }
