module Main exposing (main)

import Browser
import Json.Decode as JD
import Ports
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
      , addressInput = ""
      , miningStatus = Nothing
      , hashesChecked = 0
      , claimInput = ""
      , withdrawMax = False
      , walletInput = ""
      , view = ViewMine
      , claimStatus = Standby
      , showSecret = False
      , confirmDelete = False
      , tokenRefreshInProgress = False
      , miningError = Nothing
      , stats = Nothing
      , swapData = Nothing
      , rpcs = flags.rpc
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
        , Ports.minerCreatedCb MinerCreatedCb
        , Ports.proofCb ProofCb
        , Ports.retrySubmitProof RetrySubmitProof
        , Ports.miningError MiningError
        , Ports.proofSubmitError ProofSubmitError
        , Ports.hashCountCb HashCountCb
        , Ports.statsCb StatsCb
        , Ports.swapDataCb SwapDataCb
        , Ports.claimCb
            (decodeResult JD.string
                >> ClaimRes
            )
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
