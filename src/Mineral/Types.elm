module Mineral.Types exposing (Commit, Coord, GameStats, MineralStats, Player, Tx)

{-|


## Aliases

@docs Commit, Coord, GameStats, MineralStats, Player, Tx

-}

import OpenApi.Common


type alias Tx =
    { bytes : String, signature : String }


type alias Player =
    { registration : OpenApi.Common.Nullable Commit
    , stake : OpenApi.Common.Nullable String
    }


type alias MineralStats =
    { daysMining : Int
    , rewardRate : Float
    , totalHashes : Int
    , totalRewards : Float
    }


type alias GameStats =
    { board : List Int, spectators : Int }


type alias Coord =
    { x : Int, y : Int }


type alias Commit =
    { choice : OpenApi.Common.Nullable Coord, game : Int, round : Int }
