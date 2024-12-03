import * as ascii from "./ascii/structs";
import * as bitVector from "./bit-vector/structs";
import * as fixedPoint32 from "./fixed-point32/structs";
import * as option from "./option/structs";
import * as string from "./string/structs";
import * as typeName from "./type-name/structs";
import * as uq3232 from "./uq32-32/structs";
import {StructClassLoader} from "../../../_framework/loader";

export function registerClasses(loader: StructClassLoader) { loader.register(fixedPoint32.FixedPoint32);
loader.register(uq3232.UQ32_32);
loader.register(option.Option);
loader.register(ascii.Char);
loader.register(ascii.String);
loader.register(bitVector.BitVector);
loader.register(string.String);
loader.register(typeName.TypeName);
 }
