import * as board from "./board/structs";
import {StructClassLoader} from "../_framework/loader";

export function registerClasses(loader: StructClassLoader) { loader.register(board.Board);
loader.register(board.Coord);
loader.register(board.GameResult);
loader.register(board.PlayerProgress);
loader.register(board.RegisterEvent);
loader.register(board.RoundResult);
loader.register(board.TestnetAdminCap);
 }
