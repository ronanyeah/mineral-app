module Update exposing (update)

import Maybe.Extra exposing (isJust, unwrap)
import Ports
import Process
import Task
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

        ClaimRes res ->
            ( { model | claimStatus = Response res }
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
            if model.stats == Nothing && v == ViewStats then
                ( { model | view = v, stats = Just Nothing }
                , Ports.fetchStats ()
                )

            else
                ( { model | view = v }
                , Cmd.none
                )

        ClaimMax ->
            if String.isEmpty model.addressInput then
                ( model, Cmd.none )

            else
                model.wallet
                    |> Maybe.andThen .miningAccount
                    |> unwrap ( model, Cmd.none )
                        (\miner ->
                            if model.withdrawMax then
                                ( { model | claimStatus = InProgress }
                                , Ports.claim
                                    { miner = miner.address
                                    , amount = miner.claims
                                    , recipient = model.addressInput
                                    }
                                )

                            else
                                model.claimInput
                                    |> String.toFloat
                                    |> unwrap ( model, Cmd.none )
                                        (\val ->
                                            ( { model | claimStatus = InProgress }
                                            , Ports.claim
                                                { miner = miner.address
                                                , amount = round (val * 1000000000)
                                                , recipient = model.addressInput
                                                }
                                            )
                                        )
                        )

        ToggleMax ->
            ( { model
                | withdrawMax = True
                , claimInput =
                    model.wallet
                        |> Maybe.andThen .miningAccount
                        |> unwrap ""
                            (\acc ->
                                formatFloatN 9 (toFloat acc.claims / 1000000000)
                            )
              }
            , Cmd.none
            )

        ClaimInputCh v ->
            ( { model
                | claimInput = v
                , withdrawMax = False
              }
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

        SwapDataCb data ->
            ( { model
                | swapData = Just data
              }
            , Cmd.none
            )

        StatsCb data ->
            ( { model
                | stats =
                    model.stats
                        |> Maybe.map (always (Just data))
              }
            , Cmd.none
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
