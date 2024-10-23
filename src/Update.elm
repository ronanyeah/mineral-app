module Update exposing (..)

import Dict
import Helpers.Http exposing (parseError)
import Http
import Json.Decode as JD
import Json.Encode as JE
import Maybe.Extra exposing (isJust, unwrap)
import Ports
import Process
import Random
import Result.Extra exposing (unpack)
import Task exposing (Task)
import Time
import Types exposing (..)
import Utils exposing (..)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ClearWallet ->
            if model.confirmDelete then
                ( { model
                    | wallet = Nothing
                    , confirmDelete = False
                    , showSecret = False
                    , miningStatus = Nothing
                  }
                , [ Ports.clearWallet ()
                  , if model.miningStatus == Nothing then
                        Cmd.none

                    else
                        Ports.stopMining ()
                  ]
                    |> Cmd.batch
                )

            else
                ( { model | confirmDelete = True }
                , Cmd.none
                )

        BalancesCb res ->
            res
                |> unwrap
                    ( { model
                        | tokenRefreshInProgress = False
                      }
                    , Cmd.none
                    )
                    (\balances ->
                        let
                            balanceExhausted =
                                balances.sui
                                    < Utils.minimumGasBalance
                                    && isJust model.miningStatus
                        in
                        ( { model
                            | tokenRefreshInProgress = False
                            , miningStatus =
                                if balanceExhausted then
                                    Nothing

                                else
                                    model.miningStatus
                            , wallet =
                                model.wallet
                                    |> Maybe.map
                                        (\wl ->
                                            { wl
                                                | balances = Just balances
                                            }
                                        )
                          }
                        , if balanceExhausted then
                            Ports.stopMining ()

                          else
                            Cmd.none
                        )
                    )

        ManageCoins ->
            ( model
            , Ports.combineCoins ()
            )

        Copy str ->
            ( model
            , Ports.copy str
            )

        SetView v ->
            ( { model | view = v }
            , Cmd.none
            )

        RefreshTokens ->
            ( { model | tokenRefreshInProgress = True }
            , Ports.refreshTokens ()
            )

        ToggleHide ->
            ( { model | showSecret = not model.showSecret }
            , Cmd.none
            )

        ExportWallet ->
            ( { model
                | exportWarning = not model.exportWarning
                , confirmDelete = False
                , showSecret = False
              }
            , Cmd.none
            )

        AddressInputCh v ->
            ( { model | addressInput = v }
            , Cmd.none
            )

        StopMining ->
            ( { model | miningStatus = Nothing }
            , Ports.stopMining ()
            )

        MiningError e ->
            ( { model
                | miningStatus = Nothing
                , miningError = Just e
              }
            , Ports.stopMining ()
            )

        ProofSubmitError e ->
            -- If submission fails revert to mining flow to re-verify proof
            -- Progress should not be lost
            model.wallet
                |> Maybe.andThen .miningAccount
                |> unwrap ( model, Cmd.none )
                    (\minerObj ->
                        ( { model
                            | miningStatus = Just SearchingForProof
                            , miningError = Nothing
                          }
                        , Ports.mine minerObj.address
                        )
                    )

        WalletCb wallet ->
            ( { model
                | wallet = Just wallet
                , walletInput = ""
              }
            , Cmd.none
            )

        RetrySubmitProof data ->
            if model.miningStatus == Nothing then
                ( model, Cmd.none )

            else
                ( { model
                    | miningStatus = Just SubmittingProof
                  }
                , Ports.submitProof data
                )

        ProofCb proof ->
            model.wallet
                |> Maybe.andThen
                    (\wallet ->
                        wallet.miningAccount
                            |> Maybe.map
                                (\acct ->
                                    ( model
                                    , if model.miningStatus == Nothing then
                                        -- Mining was stopped
                                        Cmd.none

                                      else
                                        Ports.submitProof
                                            { proof = proof
                                            , miner = acct.address
                                            , coinObject =
                                                wallet.balances
                                                    |> Maybe.andThen .coinObject
                                            }
                                    )
                                )
                    )
                |> Maybe.withDefault ( model, Cmd.none )

        WalletInputCh str ->
            ( { model | walletInput = str }
            , Cmd.none
            )

        MinerCreatedCb miner ->
            ( { model
                | wallet =
                    model.wallet
                        |> Maybe.map
                            (\wl ->
                                { wl
                                    | miningAccount = Just miner
                                }
                            )
              }
            , if model.miningStatus == Nothing then
                -- Mining has been cancelled
                Cmd.none

              else
                Ports.mine miner.address
            )

        StatusCb statusCode ->
            let
                status =
                    case statusCode of
                        1 ->
                            SearchingForProof

                        2 ->
                            ValidProofFound

                        3 ->
                            SubmittingProof

                        4 ->
                            MiningSuccess

                        5 ->
                            WaitingForReset

                        _ ->
                            -- Unexpected case
                            SearchingForProof

                claimComplete =
                    status == MiningSuccess
            in
            if model.miningStatus == Nothing then
                -- Mining was stopped
                ( model, Cmd.none )

            else
                ( { model
                    | miningStatus = Just status
                    , miningError = Nothing
                    , hashesChecked =
                        if claimComplete then
                            0

                        else
                            model.hashesChecked
                  }
                , if claimComplete then
                    [ Process.sleep 3000
                        |> Task.perform (always UnsetMessage)
                    , model.wallet
                        |> Maybe.andThen .miningAccount
                        |> unwrap Cmd.none
                            (.address >> Ports.mine)
                    ]
                        |> Cmd.batch

                  else
                    Cmd.none
                )

        UnsetMessage ->
            ( { model
                | miningStatus =
                    if model.miningStatus == Just MiningSuccess then
                        Just SearchingForProof

                    else
                        model.miningStatus
              }
            , Cmd.none
            )

        HashCountCb n ->
            ( { model | hashesChecked = n }
            , Cmd.none
            )

        Mine ->
            ( { model
                | miningStatus = Just SearchingForProof
                , miningError = Nothing
              }
            , model.wallet
                |> Maybe.andThen .miningAccount
                |> unwrap (Ports.registerMiner ())
                    (.address >> Ports.mine)
            )

        ConfirmWallet ->
            if String.isEmpty model.walletInput then
                ( model, Cmd.none )

            else
                ( { model | exportWarning = False }
                , Ports.importWallet (Just model.walletInput)
                )

        CreateWallet ->
            ( { model | exportWarning = True }
            , Ports.importWallet Nothing
            )

        EnterAsPlayer ->
            ( { model
                | sweepView = SweepPlay
                , player =
                    model.player
                        |> Maybe.map (\p -> { p | inPlay = True })
              }
            , Ports.wsConnect True
            )

        Disconnect ->
            ( model
            , Ports.disconnect ()
            )

        SetModeView v ->
            let
                stopMining =
                    isJust model.miningStatus
            in
            ( { model
                | viewMode = v
                , miningStatus =
                    if stopMining then
                        Nothing

                    else
                        model.miningStatus
              }
            , if stopMining then
                Ports.stopMining ()

              else
                Cmd.none
            )

        SetSweepView v ->
            ( { model
                | sweepView = v
              }
            , Cmd.none
            )

        SignedCb tx ->
            ( model
            , Http.task
                { method = "POST"
                , headers = []
                , url = model.backend ++ "/submit"
                , body =
                    [ ( "signature", JE.string tx.signature )
                    , ( "bytes", JE.string tx.bytes )
                    ]
                        |> JE.object
                        |> Http.jsonBody
                , resolver =
                    decodeCommit
                        |> Helpers.Http.jsonResolver
                , timeout = Nothing
                }
                |> Task.attempt PlayerCb
            )

        SubmitCb res ->
            res
                |> unpack
                    (\err ->
                        ( model
                        , Ports.log ("SubmitCb:\n" ++ parseError err)
                        )
                    )
                    (\val ->
                        ( model
                        , Ports.log val
                        )
                    )

        CheckPlayerStatus ->
            model.connectedWallet
                |> unwrap
                    ( model, Cmd.none )
                    (\w ->
                        ( model
                        , getRequest (model.backend ++ "/player/" ++ w)
                            decodeCommit
                            |> Task.attempt PlayerCb
                        )
                    )

        MineCb res ->
            ( { model
                | demoMines =
                    res
                        |> List.filter
                            (\m ->
                                not
                                    (List.member m model.demoMines)
                            )
              }
            , Process.sleep 1500
                |> Task.andThen
                    (always generateDemoMines)
                |> Task.perform MineCb
            )

        Continue ->
            ( { model | playerResult = Nothing }
            , Cmd.none
            )

        Tick t ->
            ( { model
                | time = t
              }
            , Cmd.none
            )

        Spectate ->
            ( { model
                | playerResult = Nothing
                , sweepView = SweepPlay
                , player =
                    model.player
                        |> Maybe.map (\p -> { p | inPlay = False })
              }
            , if model.wsConnected then
                Ports.wsConnect False

              else
                Cmd.none
            )

        PollingTick now ->
            let
                gameIsStarting =
                    model.board
                        |> unwrap False
                            (\board ->
                                case board.status of
                                    BoardWaiting data ->
                                        data.startTime <= now

                                    _ ->
                                        False
                            )

                shouldFetch =
                    not model.pollingInProgress
                        && (model.sweepView == SweepPlay && not model.wsConnected)
                        || (model.sweepView == SweepHome && gameIsStarting)
            in
            ( { model | pollingInProgress = shouldFetch }
            , if shouldFetch then
                fetchBoard model.backend model.spectatorId
                    |> Task.attempt PollBoardCb

              else
                Cmd.none
            )

        PollBoardCb res ->
            res
                |> unpack
                    (\err ->
                        ( { model | pollingInProgress = False }
                        , Ports.log ("PollBoardCb:\n" ++ parseError err)
                        )
                    )
                    (\data ->
                        ( { model
                            | pollingInProgress = False
                            , spectators = data.spectators
                          }
                        , Ports.boardBytes data.board
                        )
                    )

        StatsCb res ->
            res
                |> unpack
                    (\err ->
                        ( model
                        , Ports.log ("StatsCb:\n" ++ parseError err)
                        )
                    )
                    (\stats ->
                        ( { model
                            | stats = Just (Just stats)
                          }
                        , Cmd.none
                        )
                    )

        ClaimPrize ->
            ( model
            , Ports.claimPrize ()
            )

        ConnectWallet ->
            ( model
            , Ports.connectWallet ()
            )

        WsConnectCb val ->
            ( { model | wsConnected = val }
            , Cmd.none
            )

        ConnectCb val ->
            ( { model
                | connectedWallet = val
              }
            , Cmd.none
            )

        SelectSquare coord verify ->
            ( model
            , Ports.selectSquare
                { square = coord
                , verify = verify
                }
            )

        BoardCb res ->
            res
                |> (\val ->
                        --[ val.playingData
                        --|> Maybe.map Playing
                        --, val.waitingData
                        --|> Maybe.map BoardWaiting
                        --, Just Ended
                        --]
                        --|> Maybe.Extra.values
                        --|> List.head
                        decodeGameStatus val.status
                            |> Result.toMaybe
                            |> Maybe.map
                                (\s ->
                                    { game = val.game
                                    , status = s
                                    , startingPlayers = val.startingPlayers
                                    , previousGame = val.previousGame
                                    , previousRound =
                                        val.previousRound
                                            |> Maybe.map
                                                (\v ->
                                                    { safePlayers = v.safePlayers
                                                    , eliminated = v.eliminated
                                                    , mines = v.mines
                                                    , counts = Dict.fromList v.counts
                                                    , status = v.status
                                                    }
                                                )
                                    , counts = Dict.fromList val.counts
                                    }
                                )
                   )
                |> unwrap
                    ( model
                    , Ports.log "board decode fail"
                    )
                    (\newBoard ->
                        model.board
                            |> unwrap
                                ( { model
                                    | board =
                                        Just newBoard
                                  }
                                , Cmd.none
                                )
                                (\prevBoard ->
                                    let
                                        wsChange =
                                            if model.sweepView /= SweepPlay then
                                                Nothing

                                            else if model.wsConnected then
                                                case newBoard.status of
                                                    Playing data ->
                                                        model.player
                                                            |> Maybe.andThen .commit
                                                            |> unwrap Nothing
                                                                (\pl ->
                                                                    if validatePlayerAgainstGame data pl newBoard then
                                                                        Nothing

                                                                    else
                                                                        Just False
                                                                )

                                                    Ended ->
                                                        Just True

                                                    BoardWaiting _ ->
                                                        Just True

                                            else
                                                case newBoard.status of
                                                    Playing data ->
                                                        model.player
                                                            |> Maybe.andThen .commit
                                                            |> Maybe.map
                                                                (\pl ->
                                                                    validatePlayerAgainstGame data pl newBoard
                                                                )

                                                    Ended ->
                                                        Nothing

                                                    BoardWaiting _ ->
                                                        Nothing

                                        newRoundData =
                                            -- final round advance does not count
                                            case newBoard.status of
                                                Playing p2 ->
                                                    case prevBoard.status of
                                                        Playing p1 ->
                                                            if p1.round /= p2.round then
                                                                Just p2

                                                            else
                                                                Nothing

                                                        _ ->
                                                            Nothing

                                                _ ->
                                                    Nothing

                                        playerResult =
                                            Maybe.map3 buildPlayerResult
                                                newRoundData
                                                newBoard.previousRound
                                                (model.player
                                                    |> Maybe.andThen
                                                        (\pl ->
                                                            if pl.inPlay then
                                                                pl.commit

                                                            else
                                                                Nothing
                                                        )
                                                )
                                    in
                                    ( { model
                                        | board = Just newBoard
                                        , playerResult =
                                            model.playerResult
                                                |> Maybe.Extra.or playerResult
                                      }
                                    , wsChange
                                        |> unwrap Cmd.none Ports.wsConnect
                                    )
                                )
                    )

        PlayerCb res ->
            res
                |> unpack
                    (\err ->
                        ( model
                        , Ports.log ("PlayerCb:\n" ++ parseError err)
                        )
                    )
                    (\val ->
                        ( { model
                            | player =
                                Just
                                    { commit = val
                                    , stake = Nothing
                                    , inPlay =
                                        model.board
                                            |> Maybe.andThen parsePlayingData
                                            |> Maybe.andThen
                                                (\( board, pd ) ->
                                                    val
                                                        |> Maybe.map
                                                            (\com ->
                                                                validatePlayerAgainstGame pd com board
                                                            )
                                                )
                                            |> Maybe.withDefault False
                                    }
                          }
                        , Cmd.none
                        )
                    )

        JoinGame ->
            ( model
            , Ports.joinGame ()
            )


decodeStats =
    JD.map4 Ports.Stats
        (JD.field "total_hashes" JD.int)
        (JD.field "total_rewards" JD.float)
        (JD.field "reward_rate" JD.float)
        (JD.field "days_mining" JD.int)


decodeCommit =
    JD.map3 Commit
        (JD.field "game" JD.int)
        (JD.field "round" JD.int)
        (JD.map2 Ports.Choice
            (JD.field "x" JD.int)
            (JD.field "y" JD.int)
            |> JD.nullable
            |> JD.field "choice"
        )
        |> JD.nullable


buildPlayerResult playData prevRound commit =
    commit.choice
        |> unwrap
            { outcome = DidNotPlay
            , mines = prevRound.mines
            , playerChoice = Nothing
            , counts = prevRound.counts
            , round = playData.round - 1
            }
            (\choice ->
                let
                    participated =
                        commit.round == playData.round - 1
                in
                { outcome =
                    if participated then
                        if prevRound.status == "wipeout" then
                            Wipeout

                        else if List.member choice prevRound.mines then
                            Eliminated

                        else
                            Survived

                    else
                        DidNotPlay
                , mines = prevRound.mines
                , playerChoice = Just choice
                , counts = prevRound.counts
                , round = playData.round - 1
                }
            )


fetchBoard : String -> String -> Task Http.Error BoardData
fetchBoard backend spectatorId =
    Http.task
        { method = "POST"
        , headers = []
        , url = backend ++ "/status"
        , body =
            JE.string spectatorId
                |> Http.jsonBody
        , resolver =
            JD.map2 BoardData
                (JD.field "board" (JD.list JD.int))
                (JD.field "spectators" JD.int)
                |> Helpers.Http.jsonResolver
        , timeout = Nothing
        }


getRequest : String -> JD.Decoder a -> Task Http.Error a
getRequest =
    request "GET"


request : String -> String -> JD.Decoder a -> Task Http.Error a
request method url jd =
    Http.task
        { method = method
        , headers = []
        , url = url
        , body = Http.emptyBody
        , resolver = Helpers.Http.jsonResolver jd
        , timeout = Nothing
        }


parsePlayingData : Board -> Maybe ( Board, PlayingData )
parsePlayingData board =
    case board.status of
        Playing data ->
            Just ( board, data )

        _ ->
            Nothing


validatePlayerAgainstGame : PlayingData -> Commit -> Board -> Bool
validatePlayerAgainstGame data player board =
    let
        roundMatch =
            board.game == player.game

        stillInPlay =
            (data.round == player.round)
                || ((player.round == data.round - 1)
                        && (Maybe.map2
                                (\choice prev ->
                                    prev.status
                                        == "wipeout"
                                        || (List.member choice prev.mines
                                                |> not
                                           )
                                )
                                player.choice
                                board.previousRound
                                |> Maybe.withDefault False
                           )
                   )
    in
    roundMatch && stillInPlay


decodeGameStatus statusData =
    case statusData.kind of
        "ended" ->
            Ok Ended

        "playing" ->
            statusData.data
                |> JD.decodeValue
                    (JD.map3 PlayingData
                        (JD.field "round" JD.int)
                        (JD.field "guessCutoff" JD.int)
                        (JD.field "choices" JD.int)
                        |> JD.map Playing
                    )
                |> Result.mapError JD.errorToString

        "waiting" ->
            statusData.data
                |> JD.decodeValue
                    (JD.map2 WaitingData
                        (JD.field "registered" JD.int)
                        (JD.field "startTime" JD.int)
                        |> JD.map BoardWaiting
                    )
                |> Result.mapError JD.errorToString

        _ ->
            Err "what"


generateDemoMines =
    Time.now
        |> Task.map
            (Time.posixToMillis
                >> Random.initialSeed
                >> Random.step
                    (Random.map2 Ports.Choice
                        (Random.int 0 19)
                        (Random.int 0 19)
                        |> Random.list 70
                    )
                >> Tuple.first
            )
