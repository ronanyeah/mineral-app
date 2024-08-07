import * as package_source_1 from "../_dependencies/source/0x1/init";
import * as package_source_2 from "../_dependencies/source/0x2/init";
import * as package_source_bafd431cc9362367d02dc2752216782a265216af069d70a7679de5f38c0d62ca from "../_dependencies/source/0xbafd431cc9362367d02dc2752216782a265216af069d70a7679de5f38c0d62ca/init";
import * as package_source_9cde6fd22c9518820644dd1350ac1595bb23751033d247465ff3c7572d9a7049 from "../mineral/init";
import {StructClassLoader} from "./loader";

function registerClassesSource(loader: StructClassLoader) { package_source_1.registerClasses(loader);
package_source_2.registerClasses(loader);
package_source_9cde6fd22c9518820644dd1350ac1595bb23751033d247465ff3c7572d9a7049.registerClasses(loader);
package_source_bafd431cc9362367d02dc2752216782a265216af069d70a7679de5f38c0d62ca.registerClasses(loader);
 }

export function registerClasses(loader: StructClassLoader) { registerClassesSource(loader); }
