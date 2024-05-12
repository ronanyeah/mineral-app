module Main exposing (main)

import Browser
import Json.Decode as JD
import Ports
import Time
import Types exposing (..)
import Update exposing (update)
import View exposing (view)


main : Program Flags Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


init : Flags -> ( Model, Cmd Msg )
init flags =
    ( { balance = 0
      , exportWarning = False
      , persistSuccessMessage = False
      , addressInput = ""
      , miningStatus = Nothing
      , claimInput = ""
      , withdrawMax = False
      , walletInput = ""
      , view = ViewMine
      , claimStatus = Standby
      , showSecret = False
      , proof = Nothing
      , confirmDelete = False
      , currentTime = flags.time
      , tokenRefreshInProgress = False
      , wallet =
            flags.wallet
                |> Maybe.map
                    (\kp ->
                        { address = kp.pub
                        , privateKey = kp.pvt
                        , balances = Nothing
                        , miningAccount = Nothing
                        }
                    )
      }
    , Cmd.none
    )


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.batch
        [ Ports.balancesCb BalancesCb
        , Ports.walletCb WalletCb
        , Ports.statusCb StatusCb
        , Ports.minerAccountCb MinerCb
        , Ports.minerCreatedCb MinerCreatedCb
        , Ports.proofCb ProofCb
        , Ports.retrySubmitProof RetrySubmitProof
        , Ports.miningError MiningError
        , Ports.claimCb
            (decodeResult JD.string
                >> ClaimRes
            )
        , Time.every 1000 (Time.posixToMillis >> Tick)
        ]


decodeResult decoder =
    JD.decodeValue
        (JD.oneOf
            [ JD.field "ok"
                (decoder
                    |> JD.map Ok
                )
            , JD.field "err"
                (JD.string
                    |> JD.map Err
                )
            ]
        )
        >> Result.withDefault (Err "500")
