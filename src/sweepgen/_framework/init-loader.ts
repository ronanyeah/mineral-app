import * as package_source_1 from "../_dependencies/source/0x1/init";
import * as package_source_2 from "../_dependencies/source/0x2/init";
import * as package_source_2834ca4df5c2712296458f1b38b27975b4555433289592667fffc3c096cfb25e from "../minesweep/init";
import {StructClassLoader} from "./loader";

function registerClassesSource(loader: StructClassLoader) { package_source_1.registerClasses(loader);
package_source_2.registerClasses(loader);
package_source_2834ca4df5c2712296458f1b38b27975b4555433289592667fffc3c096cfb25e.registerClasses(loader);
 }

export function registerClasses(loader: StructClassLoader) { registerClassesSource(loader); }
