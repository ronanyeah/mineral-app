import * as package_1 from "../_dependencies/source/0x1/init";
import * as package_2 from "../_dependencies/source/0x2/init";
import * as package_bafd431cc9362367d02dc2752216782a265216af069d70a7679de5f38c0d62ca from "../_dependencies/source/0xbafd431cc9362367d02dc2752216782a265216af069d70a7679de5f38c0d62ca/init";
import * as package_0 from "../mineral/init";
import {structClassLoaderSource as structClassLoader} from "./loader";

let initialized = false; export function initLoaderIfNeeded() { if (initialized) { return }; initialized = true; package_0.registerClasses(structClassLoader);
package_1.registerClasses(structClassLoader);
package_2.registerClasses(structClassLoader);
package_bafd431cc9362367d02dc2752216782a265216af069d70a7679de5f38c0d62ca.registerClasses(structClassLoader);
 }
