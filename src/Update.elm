module Update exposing (update)

import Maybe.Extra exposing (unwrap)
import Ports
import Process
import Task
import Types exposing (..)
import Utils exposing (..)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Tick n ->
            ( { model
                | currentTime = n
              }
            , Cmd.none
            )

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

        BalancesCb bls ->
            ( { model
                | tokenRefreshInProgress = False
                , wallet =
                    model.wallet
                        |> Maybe.map
                            (\wl ->
                                { wl
                                    | balances =
                                        Maybe.Extra.or
                                            bls
                                            wl.balances
                                }
                            )
              }
            , Cmd.none
            )

        Copy str ->
            ( model
            , Ports.copy str
            )

        SetView v ->
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

        MiningError _ ->
            ( { model
                | miningStatus = Nothing
              }
            , Ports.stopMining ()
            )

        WalletCb kp ->
            ( { model
                | wallet =
                    Just
                        { address = kp.pub
                        , privateKey = kp.pvt
                        , balances = Nothing
                        , miningAccount = Nothing
                        }
                , walletInput = ""
              }
            , Cmd.none
            )

        RetrySubmitProof data ->
            ( model, Ports.submitProof data )

        ProofCb proof ->
            model.wallet
                |> Maybe.andThen .miningAccount
                |> unwrap ( model, Cmd.none )
                    (\acct ->
                        ( { model | proof = Just proof }
                        , if model.miningStatus == Nothing then
                            -- Mining was stopped
                            Cmd.none

                          else
                            Ports.submitProof
                                { proof = proof
                                , miner = acct.address
                                }
                        )
                    )

        WalletInputCh str ->
            ( { model | walletInput = str }
            , Cmd.none
            )

        MinerCb miner ->
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

        StatusCb val ->
            let
                claimComplete =
                    val == "4"
            in
            if model.miningStatus == Nothing then
                -- Mining was stopped
                ( model, Cmd.none )

            else
                ( { model
                    | miningStatus =
                        model.miningStatus
                            |> Maybe.map
                                (always
                                    (if claimComplete then
                                        "1"

                                     else
                                        val
                                    )
                                )
                    , persistSuccessMessage =
                        if claimComplete then
                            True

                        else
                            model.persistSuccessMessage
                    , proof =
                        if claimComplete then
                            Nothing

                        else
                            model.proof
                  }
                , if claimComplete then
                    [ Process.sleep 1000
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
            ( { model | persistSuccessMessage = False }
            , Cmd.none
            )

        Mine ->
            ( { model
                | miningStatus = Just "1"
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
