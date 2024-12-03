module Mineral.Json exposing
    ( encodeCommit, encodeCoord, encodeGameStats, encodeMineralStats, encodePlayer, encodeTx
    , decodeCommit, decodeCoord, decodeGameStats, decodeMineralStats, decodePlayer, decodeTx
    )

{-|


## Encoders

@docs encodeCommit, encodeCoord, encodeGameStats, encodeMineralStats, encodePlayer, encodeTx


## Decoders

@docs decodeCommit, decodeCoord, decodeGameStats, decodeMineralStats, decodePlayer, decodeTx

-}

import Json.Decode
import Json.Encode
import Mineral.Types
import OpenApi.Common


decodeTx : Json.Decode.Decoder Mineral.Types.Tx
decodeTx =
    Json.Decode.succeed
        (\bytes signature -> { bytes = bytes, signature = signature })
        |> OpenApi.Common.jsonDecodeAndMap
            (Json.Decode.field "bytes" Json.Decode.string)
        |> OpenApi.Common.jsonDecodeAndMap
            (Json.Decode.field
                "signature"
                Json.Decode.string
            )


encodeTx : Mineral.Types.Tx -> Json.Encode.Value
encodeTx rec =
    Json.Encode.object
        [ ( "bytes", Json.Encode.string rec.bytes )
        , ( "signature", Json.Encode.string rec.signature )
        ]


decodePlayer : Json.Decode.Decoder Mineral.Types.Player
decodePlayer =
    Json.Decode.succeed
        (\registration stake -> { registration = registration, stake = stake })
        |> OpenApi.Common.jsonDecodeAndMap
            (Json.Decode.field
                "registration"
                (Json.Decode.oneOf
                    [ Json.Decode.map
                        OpenApi.Common.Present
                        decodeCommit
                    , Json.Decode.null OpenApi.Common.Null
                    ]
                )
            )
        |> OpenApi.Common.jsonDecodeAndMap
            (Json.Decode.field
                "stake"
                (Json.Decode.oneOf
                    [ Json.Decode.map
                        OpenApi.Common.Present
                        Json.Decode.string
                    , Json.Decode.null
                        OpenApi.Common.Null
                    ]
                )
            )


encodePlayer : Mineral.Types.Player -> Json.Encode.Value
encodePlayer rec =
    Json.Encode.object
        [ ( "registration"
          , case rec.registration of
                OpenApi.Common.Null ->
                    Json.Encode.null

                OpenApi.Common.Present value ->
                    encodeCommit value
          )
        , ( "stake"
          , case rec.stake of
                OpenApi.Common.Null ->
                    Json.Encode.null

                OpenApi.Common.Present value ->
                    Json.Encode.string value
          )
        ]


decodeMineralStats : Json.Decode.Decoder Mineral.Types.MineralStats
decodeMineralStats =
    Json.Decode.succeed
        (\daysMining rewardRate totalHashes totalRewards ->
            { daysMining = daysMining
            , rewardRate = rewardRate
            , totalHashes = totalHashes
            , totalRewards = totalRewards
            }
        )
        |> OpenApi.Common.jsonDecodeAndMap
            (Json.Decode.field "daysMining" Json.Decode.int)
        |> OpenApi.Common.jsonDecodeAndMap
            (Json.Decode.field
                "rewardRate"
                Json.Decode.float
            )
        |> OpenApi.Common.jsonDecodeAndMap
            (Json.Decode.field
                "totalHashes"
                Json.Decode.int
            )
        |> OpenApi.Common.jsonDecodeAndMap
            (Json.Decode.field
                "totalRewards"
                Json.Decode.float
            )


encodeMineralStats : Mineral.Types.MineralStats -> Json.Encode.Value
encodeMineralStats rec =
    Json.Encode.object
        [ ( "daysMining", Json.Encode.int rec.daysMining )
        , ( "rewardRate", Json.Encode.float rec.rewardRate )
        , ( "totalHashes", Json.Encode.int rec.totalHashes )
        , ( "totalRewards", Json.Encode.float rec.totalRewards )
        ]


decodeGameStats : Json.Decode.Decoder Mineral.Types.GameStats
decodeGameStats =
    Json.Decode.succeed
        (\board spectators -> { board = board, spectators = spectators })
        |> OpenApi.Common.jsonDecodeAndMap
            (Json.Decode.field
                "board"
                (Json.Decode.list Json.Decode.int)
            )
        |> OpenApi.Common.jsonDecodeAndMap
            (Json.Decode.field
                "spectators"
                Json.Decode.int
            )


encodeGameStats : Mineral.Types.GameStats -> Json.Encode.Value
encodeGameStats rec =
    Json.Encode.object
        [ ( "board", Json.Encode.list Json.Encode.int rec.board )
        , ( "spectators", Json.Encode.int rec.spectators )
        ]


decodeCoord : Json.Decode.Decoder Mineral.Types.Coord
decodeCoord =
    Json.Decode.succeed
        (\x y -> { x = x, y = y })
        |> OpenApi.Common.jsonDecodeAndMap
            (Json.Decode.field
                "x"
                Json.Decode.int
            )
        |> OpenApi.Common.jsonDecodeAndMap
            (Json.Decode.field
                "y"
                Json.Decode.int
            )


encodeCoord : Mineral.Types.Coord -> Json.Encode.Value
encodeCoord rec =
    Json.Encode.object
        [ ( "x", Json.Encode.int rec.x ), ( "y", Json.Encode.int rec.y ) ]


decodeCommit : Json.Decode.Decoder Mineral.Types.Commit
decodeCommit =
    Json.Decode.succeed
        (\choice game round -> { choice = choice, game = game, round = round })
        |> OpenApi.Common.jsonDecodeAndMap
            (Json.Decode.field
                "choice"
                (Json.Decode.oneOf
                    [ Json.Decode.map
                        OpenApi.Common.Present
                        decodeCoord
                    , Json.Decode.null OpenApi.Common.Null
                    ]
                )
            )
        |> OpenApi.Common.jsonDecodeAndMap
            (Json.Decode.field "game" Json.Decode.int)
        |> OpenApi.Common.jsonDecodeAndMap
            (Json.Decode.field
                "round"
                Json.Decode.int
            )


encodeCommit : Mineral.Types.Commit -> Json.Encode.Value
encodeCommit rec =
    Json.Encode.object
        [ ( "choice"
          , case rec.choice of
                OpenApi.Common.Null ->
                    Json.Encode.null

                OpenApi.Common.Present value ->
                    encodeCoord value
          )
        , ( "game", Json.Encode.int rec.game )
        , ( "round", Json.Encode.int rec.round )
        ]
