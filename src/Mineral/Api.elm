module Mineral.Api exposing
    ( getBoardStatus, getBoardStatusTask, getMineralStats, getMineralStatsTask, getPlayer, getPlayerStake
    , getPlayerStakeTask, getPlayerTask, submitTransaction, submitTransactionTask
    )

{-|


## Operations

@docs getBoardStatus, getBoardStatusTask, getMineralStats, getMineralStatsTask, getPlayer, getPlayerStake
@docs getPlayerStakeTask, getPlayerTask, submitTransaction, submitTransactionTask

-}

import Dict
import Http
import Json.Decode
import Json.Encode
import Mineral.Json
import Mineral.Types
import OpenApi.Common
import Task
import Url.Builder


getPlayer :
    { toMsg :
        Result (OpenApi.Common.Error e String) (OpenApi.Common.Nullable Mineral.Types.Commit)
        -> msg
    , params : { id : String }
    }
    -> Cmd msg
getPlayer config =
    Http.request
        { url = Url.Builder.absolute [ "api", "player", config.params.id ] []
        , method = "GET"
        , headers = []
        , expect =
            OpenApi.Common.expectJsonCustom
                config.toMsg
                (Dict.fromList [])
                (Json.Decode.oneOf
                    [ Json.Decode.map
                        OpenApi.Common.Present
                        Mineral.Json.decodeCommit
                    , Json.Decode.null OpenApi.Common.Null
                    ]
                )
        , body = Http.emptyBody
        , timeout = Nothing
        , tracker = Nothing
        }


getPlayerTask :
    { params : { id : String } }
    -> Task.Task (OpenApi.Common.Error e String) (OpenApi.Common.Nullable Mineral.Types.Commit)
getPlayerTask config =
    Http.task
        { url = Url.Builder.absolute [ "api", "player", config.params.id ] []
        , method = "GET"
        , headers = []
        , resolver =
            OpenApi.Common.jsonResolverCustom
                (Dict.fromList [])
                (Json.Decode.oneOf
                    [ Json.Decode.map
                        OpenApi.Common.Present
                        Mineral.Json.decodeCommit
                    , Json.Decode.null OpenApi.Common.Null
                    ]
                )
        , body = Http.emptyBody
        , timeout = Nothing
        }


getMineralStats config =
    Http.request
        { url = Url.Builder.absolute [ "api", "stats" ] []
        , method = "GET"
        , headers = []
        , expect =
            OpenApi.Common.expectJsonCustom
                config.toMsg
                (Dict.fromList [])
                Mineral.Json.decodeMineralStats
        , body = Http.emptyBody
        , timeout = Nothing
        , tracker = Nothing
        }


getMineralStatsTask : {} -> Task.Task (OpenApi.Common.Error e String) Mineral.Types.MineralStats
getMineralStatsTask config =
    Http.task
        { url = Url.Builder.absolute [ "api", "stats" ] []
        , method = "GET"
        , headers = []
        , resolver =
            OpenApi.Common.jsonResolverCustom
                (Dict.fromList [])
                Mineral.Json.decodeMineralStats
        , body = Http.emptyBody
        , timeout = Nothing
        }


getBoardStatus config =
    Http.request
        { url = Url.Builder.absolute [ "api", "status" ] []
        , method = "POST"
        , headers = []
        , expect =
            OpenApi.Common.expectJsonCustom
                config.toMsg
                (Dict.fromList [])
                Mineral.Json.decodeGameStats
        , body = Http.stringBody "text/plain" config.body
        , timeout = Nothing
        , tracker = Nothing
        }


getBoardStatusTask :
    { body : String }
    -> Task.Task (OpenApi.Common.Error e String) Mineral.Types.GameStats
getBoardStatusTask config =
    Http.task
        { url = Url.Builder.absolute [ "api", "status" ] []
        , method = "POST"
        , headers = []
        , resolver =
            OpenApi.Common.jsonResolverCustom
                (Dict.fromList [])
                Mineral.Json.decodeGameStats
        , body = Http.stringBody "text/plain" config.body
        , timeout = Nothing
        }


submitTransaction config =
    Http.request
        { url = Url.Builder.absolute [ "api", "submit" ] []
        , method = "POST"
        , headers = []
        , expect =
            OpenApi.Common.expectJsonCustom
                config.toMsg
                (Dict.fromList [])
                Json.Decode.bool
        , body = Http.jsonBody (Mineral.Json.encodeTx config.body)
        , timeout = Nothing
        , tracker = Nothing
        }


submitTransactionTask :
    { body : Mineral.Types.Tx }
    -> Task.Task (OpenApi.Common.Error e String) Bool
submitTransactionTask config =
    Http.task
        { url = Url.Builder.absolute [ "api", "submit" ] []
        , method = "POST"
        , headers = []
        , resolver =
            OpenApi.Common.jsonResolverCustom
                (Dict.fromList [])
                Json.Decode.bool
        , body = Http.jsonBody (Mineral.Json.encodeTx config.body)
        , timeout = Nothing
        }


getPlayerStake :
    { toMsg : Result (OpenApi.Common.Error e String) Mineral.Types.Player -> msg
    , params : { id : String }
    }
    -> Cmd msg
getPlayerStake config =
    Http.request
        { url = Url.Builder.absolute [ "api", "validate", config.params.id ] []
        , method = "GET"
        , headers = []
        , expect =
            OpenApi.Common.expectJsonCustom
                config.toMsg
                (Dict.fromList [])
                Mineral.Json.decodePlayer
        , body = Http.emptyBody
        , timeout = Nothing
        , tracker = Nothing
        }


getPlayerStakeTask :
    { params : { id : String } }
    -> Task.Task (OpenApi.Common.Error e String) Mineral.Types.Player
getPlayerStakeTask config =
    Http.task
        { url = Url.Builder.absolute [ "api", "validate", config.params.id ] []
        , method = "GET"
        , headers = []
        , resolver =
            OpenApi.Common.jsonResolverCustom
                (Dict.fromList [])
                Mineral.Json.decodePlayer
        , body = Http.emptyBody
        , timeout = Nothing
        }
