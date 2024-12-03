module Update exposing (..)

import Dict
import Helpers.Http exposing (parseError)
import Http
import Json.Decode as JD
import Maybe.Extra exposing (isJust, unwrap)
import Mineral.Api
import Ports
import Process
import Random
import Result.Extra exposing (unpack)
import Svg exposing (g)
import Task exposing (Task)
import Types exposing (..)
import Utils exposing (..)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ClearWallet ->
            if model.confirmDelete then
                ( { model
                    | miningWallet = Nothing
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
                            , miningWallet =
                                model.miningWallet
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

        ProofSubmitError _ ->
            -- If submission fails revert to mining flow to re-verify proof
            -- Progress should not be lost
            model.miningWallet
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
                | miningWallet = Just wallet
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
            model.miningWallet
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
                | miningWallet =
                    model.miningWallet
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
                    , model.miningWallet
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
            , model.miningWallet
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

        Disconnect ->
            ( model
            , Ports.disconnect ()
            )

        SetModeView v ->
            if v == model.viewMode then
                ( model, Cmd.none )

            else
                (case v of
                    ViewHome ->
                        ( { model | sweepView = SweepHome }
                        , Cmd.none
                        )

                    ViewMiner ->
                        ( model, Cmd.none )

                    ViewSweep ->
                        let
                            fetchPlayerTask =
                                if model.playerAction == Loading then
                                    Nothing

                                else
                                    model.connectedWallet
                                        |> Maybe.map
                                            (\w ->
                                                fetchRegistration w
                                                    |> Task.attempt PlayerCb
                                            )
                        in
                        ( { model
                            | playerAction =
                                if isJust fetchPlayerTask then
                                    Loading

                                else
                                    model.playerAction
                          }
                        , [ fetchBoard model.spectatorId
                                |> Task.attempt PollBoardCb
                          , fetchPlayerTask
                                |> Maybe.withDefault Cmd.none
                          ]
                            |> Cmd.batch
                        )
                )
                    |> (\( md, cmds ) ->
                            let
                                stopMining =
                                    isJust model.miningStatus
                            in
                            ( { md
                                | viewMode = v
                                , miningStatus =
                                    if stopMining then
                                        Nothing

                                    else
                                        model.miningStatus
                              }
                            , [ if stopMining then
                                    Ports.stopMining ()

                                else
                                    Cmd.none
                              , cmds
                              ]
                                |> Cmd.batch
                            )
                       )

        ShowAlert v ->
            ( model
            , Ports.alert v
            )

        SetSweepView v ->
            ( { model
                | sweepView = v
              }
            , Cmd.none
            )

        SignedCb res ->
            res
                |> unpack
                    (\err ->
                        ( { model
                            | playerAction = Fail "Transaction sign fail"
                            , txInProgress = Nothing
                          }
                        , Ports.log err
                        )
                    )
                    (\tx ->
                        ( { model
                            | playerAction = Loading
                          }
                        , Mineral.Api.submitTransactionTask
                            { body =
                                { bytes = tx.bytes
                                , signature = tx.signature
                                }
                            }
                            |> Task.mapError Utils.convertError
                            |> Task.attempt TxCb
                        )
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
                        , fetchRegistration w
                            |> Task.attempt PlayerCb
                        )
                    )

        GoToBoard ->
            ( { model
                | playerResult = Nothing
                , sweepView = SweepPlay
              }
            , Cmd.none
            )

        TimeTick now ->
            ( { model
                | time = now
              }
            , Cmd.none
            )

        DemoMinesTick now ->
            let
                mines =
                    if model.viewMode == ViewSweep && model.sweepView == SweepHome then
                        now
                            |> Random.initialSeed
                            |> Random.step
                                (Random.map2 Ports.Choice
                                    (Random.int 0 19)
                                    (Random.int 0 19)
                                    |> Random.list 70
                                )
                            |> Tuple.first
                            |> List.filter
                                (\m ->
                                    not
                                        (List.member m model.demoMines)
                                )

                    else
                        model.demoMines
            in
            ( { model
                | demoMines = mines
              }
            , Cmd.none
            )

        PollingTick _ ->
            if model.pollingInProgress then
                ( model, Cmd.none )

            else
                ( { model
                    | pollingInProgress = True
                  }
                , fetchBoard model.spectatorId
                    |> Task.attempt PollBoardCb
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
            ( { model | playerAction = Loading }
            , Ports.claimPrize ()
            )

        ConnectWallet ->
            ( model
            , Ports.connectWallet ()
            )

        ConnectCb val ->
            let
                fetchPlayerCmd =
                    if model.viewMode == ViewSweep then
                        val
                            |> Maybe.map
                                (\w ->
                                    fetchRegistration w
                                        |> Task.attempt PlayerCb
                                )

                    else
                        Nothing
            in
            ( { model
                | connectedWallet = val
                , player = Nothing
                , playerAction =
                    if isJust fetchPlayerCmd then
                        Loading

                    else
                        Ready
              }
            , fetchPlayerCmd
                |> Maybe.withDefault Cmd.none
            )

        SelectSquare { coord, round } ->
            model.player
                |> Maybe.andThen .stake
                |> unwrap ( model, Cmd.none )
                    (\stake ->
                        ( { model
                            | playerAction = Loading
                            , txInProgress = Just <| TxSquareSelect round coord
                          }
                        , Ports.selectSquare
                            { square = coord
                            , verify =
                                -- add ix to verify previous selection
                                round > 1
                            , stake = stake
                            }
                        )
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
                                    , prizePool = val.prizePool
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
                                                    , status =
                                                        case v.status of
                                                            "wipeout" ->
                                                                RoundWipeout

                                                            "final" ->
                                                                RoundFinal

                                                            _ ->
                                                                RoundProceed
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
                                                    |> Maybe.andThen .commit
                                                )
                                                |> Maybe.andThen identity
                                    in
                                    ( { model
                                        | board = Just newBoard
                                        , playerResult =
                                            playerResult
                                                |> Maybe.Extra.orElse model.playerResult
                                      }
                                    , Cmd.none
                                    )
                                )
                    )

        TxCb res ->
            res
                |> unpack
                    (\err ->
                        ( { model | playerAction = Fail <| parseError err }
                        , Ports.log ("TxCb:\n" ++ parseError err)
                        )
                    )
                    (\txOk ->
                        if txOk then
                            model.txInProgress
                                |> unwrap
                                    ( model, Ports.log "Tx not found" )
                                    (\tx ->
                                        case tx of
                                            TxSquareSelect round coord ->
                                                ( { model
                                                    | playerAction = Ready
                                                    , txInProgress = Nothing
                                                    , player =
                                                        model.player
                                                            |> Maybe.map
                                                                (\player ->
                                                                    { commit =
                                                                        player.commit
                                                                            |> Maybe.map
                                                                                (\c ->
                                                                                    { c
                                                                                        | choice = Just coord
                                                                                        , round = round
                                                                                    }
                                                                                )
                                                                    , stake = player.stake
                                                                    }
                                                                )
                                                  }
                                                , Cmd.none
                                                )

                                            TxRegister g ->
                                                ( { model
                                                    | playerAction = Ready
                                                    , txInProgress = Nothing
                                                    , player =
                                                        Just
                                                            { commit =
                                                                Just
                                                                    { game = g
                                                                    , choice = Nothing
                                                                    , round = 1
                                                                    }
                                                            , stake =
                                                                model.player
                                                                    |> Maybe.andThen .stake
                                                            }
                                                  }
                                                , Cmd.none
                                                )
                                    )

                        else
                            ( { model
                                | playerAction = Fail "Tx fail"
                                , txInProgress = Nothing
                              }
                            , Ports.alert "There was a problem. Please try again."
                            )
                    )

        PlayerCb res ->
            res
                |> unpack
                    (\err ->
                        ( { model | playerAction = Fail <| parseError err }
                        , Ports.log ("PlayerCb:\n" ++ parseError err)
                        )
                    )
                    (\data ->
                        ( { model
                            | playerAction = Ready
                            , player =
                                Just
                                    { commit = data.registration
                                    , stake = data.stake
                                    }
                          }
                        , Cmd.none
                        )
                    )

        JoinGame game stake ->
            ( { model
                | playerAction = Loading
                , txInProgress = Just <| TxRegister game
              }
            , Ports.joinGame { stake = stake }
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


buildPlayerResult game prevRound player =
    let
        previousRound =
            game.round - 1
    in
    if player.round < previousRound then
        -- stale player
        Nothing

    else
        player.choice
            |> unwrap
                (if game.round == 2 then
                    -- can only DNP with no choice in round 1
                    -- otherwise stale
                    Just
                        { outcome = DidNotPlay
                        , mines = prevRound.mines
                        , playerChoice = Nothing
                        , counts = prevRound.counts
                        , round = previousRound
                        }

                 else
                    Nothing
                )
                (\choice ->
                    let
                        participated =
                            player.round == previousRound
                    in
                    { outcome =
                        if participated then
                            if prevRound.status == RoundWipeout then
                                Wipeout

                            else if List.member choice prevRound.mines then
                                Eliminated

                            else
                                Survived

                        else
                            DidNotPlay
                    , mines = prevRound.mines
                    , playerChoice =
                        if participated then
                            Just choice

                        else
                            Nothing
                    , counts = prevRound.counts
                    , round = previousRound
                    }
                        |> Just
                )


fetchBoard : String -> Task Http.Error BoardData
fetchBoard spectatorId =
    Mineral.Api.getBoardStatusTask { body = spectatorId }
        |> Task.mapError Utils.convertError


fetchPlayer : String -> String -> Task Http.Error Commit
fetchPlayer _ w =
    Mineral.Api.getPlayerTask { params = { id = w } }
        |> Task.mapError Utils.convertError
        |> Task.andThen
            (convertNullable
                >> unwrap
                    (Task.fail (Http.BadStatus 404))
                    (\body ->
                        { choice = convertNullable body.choice
                        , game = body.game
                        , round = body.round
                        }
                            |> Task.succeed
                    )
            )


fetchRegistration : String -> Task Http.Error PlayerStatus
fetchRegistration w =
    Mineral.Api.getPlayerStakeTask { params = { id = w } }
        |> Task.map
            (\body ->
                { registration =
                    body.registration
                        |> convertNullable
                        |> Maybe.map
                            (\c ->
                                { choice = convertNullable c.choice
                                , game = c.game
                                , round = c.round
                                }
                            )
                , stake = convertNullable body.stake
                }
            )
        |> Task.mapError Utils.convertError


validatePlayerAgainstGame : PlayingData -> Commit -> Board -> Bool
validatePlayerAgainstGame game player board =
    let
        gameMatch =
            board.game == player.game

        roundMatch =
            game.round == player.round

        survivedPrevious =
            (player.round == game.round - 1)
                && (Maybe.map2
                        (\choice prev ->
                            prev.status
                                == RoundWipeout
                                || (List.member choice prev.mines
                                        |> not
                                   )
                        )
                        -- ensure chose in previous round
                        player.choice
                        board.previousRound
                        |> Maybe.withDefault False
                   )
    in
    gameMatch && (roundMatch || survivedPrevious)


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
