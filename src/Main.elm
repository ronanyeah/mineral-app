module Main exposing (main)

import Browser
import Json.Decode as JD
import Maybe.Extra
import Mineral.Api
import PortResult
import Ports
import Task
import Time
import Types exposing (..)
import Update exposing (update)
import Utils
import View exposing (view)


main : Program Ports.Flags Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


init : Ports.Flags -> ( Model, Cmd Msg )
init flags =
    ( { balance = 0
      , txInProgress = Nothing
      , screen = flags.screen
      , exportWarning = False
      , addressInput = ""
      , miningStatus = Nothing
      , hashesChecked = 0
      , walletInput = ""
      , view = ViewMine
      , showSecret = False
      , confirmDelete = False
      , tokenRefreshInProgress = False
      , miningError = Nothing
      , stats = Nothing
      , rpcs = flags.rpc
      , time = flags.time
      , demoMines = []
      , playerResult = Nothing
      , connectedWallet = Nothing
      , player = Nothing
      , board = Nothing
      , sweepView = SweepHome
      , pollingInProgress = False
      , spectators = 0
      , spectatorId = flags.spectatorId
      , viewMode = ViewHome
      , playerAction = Ready
      , miningWallet =
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
    , Mineral.Api.getMineralStatsTask {}
        |> Task.mapError Utils.convertError
        |> Task.attempt StatsCb
    )


subscriptions : Model -> Sub Msg
subscriptions model =
    let
        pollingCmd =
            if model.viewMode == ViewSweep then
                model.board
                    |> Maybe.map
                        (\board ->
                            case board.status of
                                BoardWaiting _ ->
                                    5000

                                Ended ->
                                    15000

                                Playing _ ->
                                    1000
                        )
                    |> Maybe.Extra.unwrap Sub.none
                        (\interval ->
                            Time.every
                                interval
                                (Time.posixToMillis >> PollingTick)
                        )

            else
                Sub.none
    in
    Sub.batch
        [ pollingCmd
        , Ports.balancesCb BalancesCb
        , Ports.walletCb WalletCb
        , Ports.statusCb StatusCb
        , Ports.minerCreatedCb MinerCreatedCb
        , Ports.proofCb ProofCb
        , Ports.retrySubmitProof RetrySubmitProof
        , Ports.miningError MiningError
        , Ports.proofSubmitError ProofSubmitError
        , Ports.hashCountCb HashCountCb
        , Ports.connectCb ConnectCb
        , Ports.boardCb BoardCb
        , Ports.signedCb (PortResult.parse >> SignedCb)
        , Time.every 1500 (Time.posixToMillis >> DemoMinesTick)
        , Time.every 1000 (Time.posixToMillis >> TimeTick)
        ]


decodeResult : JD.Decoder value -> JD.Value -> Result String value
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
