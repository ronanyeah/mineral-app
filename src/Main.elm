module Main exposing (main)

import Browser
import Json.Decode as JD
import Ports
import Task
import Time
import Types exposing (..)
import Update exposing (update)
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
      , backend = flags.backend
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
      , wsConnected = False
      , sweepView = SweepHome
      , pollingInProgress = False
      , spectators = 0
      , spectatorId = flags.spectatorId
      , viewMode = ViewHome
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
    , [ Update.getRequest
            (flags.backend ++ "/stats")
            Update.decodeStats
            |> Task.attempt StatsCb

      --, Update.generateDemoMines
      --|> Task.perform MineCb
      --, Update.fetchBoard flags.backend flags.spectatorId
      --|> Task.attempt PollBoardCb
      ]
        |> Cmd.batch
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
        , Ports.connectCb ConnectCb
        , Ports.boardCb BoardCb
        , Ports.wsConnectCb WsConnectCb
        , Ports.signedCb SignedCb
        , Time.every 2000 (Time.posixToMillis >> Tick)

        --, Time.every 1500 (Time.posixToMillis >> PollingTick)
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
