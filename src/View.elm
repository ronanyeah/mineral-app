module View exposing (view)

import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Font as Font
import Element.Input as Input
import Helpers.View exposing (cappedHeight, cappedWidth, style, when, whenAttr, whenJust)
import Html exposing (Html)
import Html.Attributes
import Img
import Maybe.Extra exposing (unwrap)
import Types exposing (..)
import Utils exposing (..)
import View.Lib exposing (..)


view : Model -> Html Msg
view model =
    (if isDesktop model.screen then
        case model.viewMode of
            ViewHome ->
                viewSpace model (viewHome model) none

            ViewMiner ->
                viewSpace model (viewMiner model) none

            ViewSweep ->
                --viewSpace model (View.Sweep.viewDash model) (View.Sweep.viewPanel model)
                none

     else
        (case model.viewMode of
            ViewHome ->
                viewHome model

            ViewMiner ->
                viewMiner model

            ViewSweep ->
                --View.Sweep.viewDash model
                none
        )
            |> el
                [ height fill
                , width fill
                , paddingXY 0 30
                , Background.color black
                ]
    )
        |> Element.layoutWith
            { options =
                [ Element.focusStyle
                    { borderColor = Nothing
                    , backgroundColor = Nothing
                    , shadow = Nothing
                    }
                ]
            }
            [ width fill
            , height fill
            , mainFont
            , Font.color white
            , Background.color black
            ]


viewHome : Model -> Element Msg
viewHome model =
    [ [ logo 70
      , text "MINERAL"
            |> el [ Font.size 70, displayFont ]
      ]
        |> row [ spacing 20, centerX ]
    , [ text "Resource Mining"
            |> el [ Font.size 17, width fill ]
      , text "| SUI"
            |> el [ Font.size 22 ]
      , Img.sui "white" 22
            |> el [ width fill ]
      ]
        |> row [ spacing 10, centerX ]
    , [ [ text "$MINE"
            |> el
                [ Font.bold
                , padding 10
                , Background.color white
                , Font.color black
                , alignTop
                ]
        , para
            [ Font.size 17
            , Font.alignRight
            , padding 8
            ]
            "A proof-of-work mineable currency."
        ]
            |> row [ width fill ]
            |> linkOut "https://suivision.xyz/coin/0x9cde6fd22c9518820644dd1350ac1595bb23751033d247465ff3c7572d9a7049::mine::MINE" [ width fill ]
      , [ viewStats model
        ]
            |> column
                [ width fill
                , paddingEach { left = 10, right = 10, bottom = 20, top = 5 }
                ]
      ]
        |> column
            [ centerX
            , Border.width 2
            , Border.color white
            , width fill
            ]
        |> el [ width fill ]
    , [ text "MINING APPS"
            |> el [ Font.bold, padding 10, Background.color white, Font.color black ]
      , [ model.stats
            |> Maybe.andThen identity
            |> whenJust
                (\stats ->
                    [ text "Current Hash Reward:"
                        |> el [ Font.bold ]
                    , formatFloatN 4 stats.rewardRate
                        |> text
                    , text "$MINE"
                    ]
                        |> row
                            [ spacing 10
                            , centerX
                            ]
                )
        , [ text "BROWSER"
                |> solidBtn (Just (SetModeView ViewMiner)) []
          , text "CLI"
                |> linkOut "https://github.com/ronanyeah/mineral-app/blob/master/cli/README.md" btnAttrs
          ]
            |> row
                [ centerX
                , spacing 20
                ]
        ]
            |> column
                [ paddingXY 0 15
                , width fill
                , spacing 15
                ]
      ]
        |> column
            [ Font.size 17
            , Border.width 2
            , Border.color white
            , width fill
            ]
    , [ text "[REDACTED]"
            |> el [ Font.bold, padding 10, Background.color white, Font.color black ]
      , List.repeat 4
            (Img.mine "white" 30)
            |> row [ spacing 10, title "💣" ]
            --|> solidBtn (Just (SetModeView ViewSweep)) [ centerX ]
            |> el
                --btn
                --(Just (SetModeView ViewSweep))
                [ paddingXY 0 15
                , centerX
                ]
      ]
        |> column
            [ Font.size 17
            , Border.width 2
            , Border.color white
            , width fill
            ]
    , footerLinks
        |> el [ alignBottom, centerX ]
    ]
        |> column
            [ width fill
            , height fill
            , paddingXY 20 0
            , spacing 20
            , scrollbarY
            , Background.color black
            ]


viewMiner : Model -> Element Msg
viewMiner model =
    [ [ logo 70
      , text "MINERAL"
            |> el [ Font.size 70, displayFont ]
      ]
        |> row [ spacing 20 ]
        |> btn (Just (SetModeView ViewHome)) [ centerX ]
    , viewBody model
    ]
        |> column
            [ width fill
            , height fill
            , paddingXY 20 0
            , spacing 20
            , scrollbarY
            ]


viewSpace : Model -> Element Msg -> Element Msg -> Element Msg
viewSpace model vLeft vRight =
    [ vLeft
        |> el
            [ cappedHeight 800
            , Background.color black
            , spacing 40
            , paddingXY 0 30
            , Border.width 3
            , alignTop
            , cappedWidth 420
            ]
    , vRight
        |> el [ fadeIn, height fill ]
    ]
        |> row [ padding 30, spacing 40, width fill, height fill ]
        |> el
            [ height fill
            , width fill
            , style "background-image" "url('/space.png')"
            , style "background-position" "50% 50%"
            , style "background-size" "150% 150%"
            , style "animation" "floatingBackground 15s infinite ease-in-out"
            , clip
            ]


viewBody : Model -> Element Msg
viewBody model =
    model.wallet
        |> unwrap
            ([ para [ Font.center ] "You will need a Sui wallet to begin mining."
             , [ img [ height <| px 30 ] "/icons/wallet.png"
               , text "Create new wallet"
               ]
                |> row [ spacing 15 ]
                |> btn (Just CreateWallet)
                    [ Border.width 2
                    , width fill
                    , paddingXY 10 20
                    ]
             , [ Input.text
                    [ Font.color black
                    , Border.rounded 0
                    , Border.width 0
                    , spacing 10
                    , Background.color white
                    ]
                    { onChange = WalletInputCh
                    , placeholder =
                        Just <|
                            Input.placeholder [] <|
                                img [ height <| px 20 ] "/icons/lock.png"
                    , text = hideText model.walletInput
                    , label =
                        [ img [ height <| px 30 ] "/icons/brain.png"
                        , text "Import Wallet"
                        ]
                            |> row [ spacing 15 ]
                            |> Input.labelAbove []
                    }
               , text "SUBMIT"
                    |> txtBtn (Just ConfirmWallet)
                    |> el [ alignRight ]
               ]
                |> column
                    [ spacing 10
                    , width fill
                    , paddingXY 10 20
                    , Border.width 2
                    ]
             ]
                |> column [ spacing 40, width fill ]
            )
            (\wallet ->
                let
                    balanceEmpty =
                        wallet.balances
                            |> unwrap True
                                (\bals ->
                                    bals.sui < Utils.minimumGasBalance
                                )
                in
                if model.exportWarning then
                    [ [ [ [ img [ height <| px 25 ] "/icons/wallet_alt.png"
                          , text "Wallet"
                                |> el [ Font.bold ]
                          ]
                            |> row [ spacing 15 ]
                        , text
                            (if model.confirmDelete then
                                "Confirm delete?"

                             else
                                "Remove"
                            )
                            |> btn (Just ClearWallet)
                                [ Font.underline
                                , Font.size 15
                                ]
                        ]
                            |> row [ width fill, spaceEvenly ]
                      , [ text
                            (String.left 10 wallet.address
                                ++ "..."
                                ++ String.right 10 wallet.address
                            )
                        ]
                            |> row [ spacing 10 ]
                      ]
                        |> column
                            [ spacing 10
                            , width fill
                            , padding 10
                            , Border.width 2
                            ]
                    , [ img [ height <| px 40, paddingXY 10 0 ] "/icons/warning.png"
                      , para [ Font.center ] "Back up your wallet to avoid loss of funds."
                      ]
                        |> row [ width fill, spacing 0 ]
                    , para
                        [ padding 20
                        , Font.center
                        , Background.color white
                        , Font.color black
                        , Html.Attributes.style "word-break" "break-all"
                            |> htmlAttribute
                        ]
                        (if model.showSecret then
                            wallet.privateKey

                         else
                            hideText wallet.privateKey
                        )
                    , [ text
                            (if model.showSecret then
                                "HIDE"

                             else
                                "SHOW"
                            )
                            |> txtBtn (Just ToggleHide)
                      , text "COPY"
                            |> txtBtn (Just <| Copy wallet.privateKey)
                      ]
                        |> row [ spacing 20, centerX ]
                    , horizRule
                    , text "CONTINUE"
                        |> txtBtn (Just ExportWallet)
                        |> el [ centerX ]
                    ]
                        |> column [ spacing 20 ]

                else
                    [ [ [ [ [ img [ height <| px 25 ] "/icons/wallet_alt.png"
                            , text "Wallet"
                                |> el [ Font.bold ]
                            ]
                                |> row [ spacing 15 ]
                          , text "Export wallet"
                                |> btn (Just ExportWallet)
                                    [ Font.underline
                                    , Font.size 13
                                    ]
                          ]
                            |> row [ width fill, spaceEvenly ]
                        , [ text
                                (String.left 8 wallet.address
                                    ++ "..."
                                    ++ String.right 8 wallet.address
                                )
                                |> linkOut ("https://suiscan.xyz/mainnet/account/" ++ wallet.address) [ Font.underline ]
                          , img [ height <| px 25 ] "/icons/copy.png"
                                |> btn (Just (Copy wallet.address))
                                    [ title wallet.address
                                    ]
                          ]
                            |> row [ spacing 10 ]
                        ]
                            |> column
                                [ spacing 10
                                , width fill
                                , padding 10
                                , Border.width 2
                                ]
                      , [ navBtn model.view "Mine" ViewMine
                        , navBtn model.view "Settings" ViewSettings
                        ]
                            |> row [ centerX, spacing 20 ]
                            |> when (not balanceEmpty)
                      , wallet.balances
                            |> whenJust
                                (\bal ->
                                    if balanceEmpty then
                                        [ text "SUI Balance: 0.00"
                                            |> el [ centerX, Font.bold ]
                                        , para [ Font.center, Font.size 17 ]
                                            "Send SUI to this wallet to enable mining."
                                        , text "REFRESH"
                                            |> txtBtn
                                                (if model.tokenRefreshInProgress then
                                                    Nothing

                                                 else
                                                    Just RefreshTokens
                                                )
                                            |> el
                                                [ centerX
                                                , spinner 20
                                                    |> el [ paddingXY 10 0, centerY ]
                                                    |> onRight
                                                    |> whenAttr model.tokenRefreshInProgress
                                                ]
                                        ]
                                            |> column [ width fill, spacing 20 ]

                                    else
                                        viewDash model wallet bal
                                )
                      ]
                        |> column
                            [ spacing 10
                            , width fill
                            ]
                    ]
                        |> column
                            [ width fill
                            , height fill
                            , spacing 20
                            ]
            )


viewDash model wallet bal =
    case model.view of
        ViewSettings ->
            [ text "RPC"
                |> el
                    [ Font.bold
                    , centerX
                    , displayFont
                    , Font.size 30
                    ]
            , model.rpcs
                |> (\( rpc, rpcs ) ->
                        rpcs
                            |> List.map
                                (\rpc_ ->
                                    [ el [ Font.size 20, Font.bold ] (text "X")
                                        |> when (rpc_ == rpc)
                                        |> el [ width <| px 20 ]
                                    , ellipsisText 17 rpc_
                                        |> el [ width fill ]
                                    ]
                                        |> row []
                                )
                   )
                |> column [ spacing 10 ]
            ]
                |> column
                    [ width fill
                    , height <| minimum 200 <| fill
                    , Border.width 2
                    , Border.color white
                    , Background.color black
                    , spacing 20
                    , padding 10
                    ]
                |> el [ cappedWidth 350, centerX ]

        ViewManage ->
            viewManager model wallet

        ViewMine ->
            [ [ [ text "Balances"
                    |> el [ Font.bold ]
                , text "Manage"
                    |> btn
                        (if model.tokenRefreshInProgress then
                            Nothing

                         else
                            Just (SetView ViewManage)
                        )
                        [ Font.underline, Font.size 15 ]
                ]
                    |> row [ spaceEvenly, width fill ]
              , [ text
                    ("Sui: "
                        ++ formatFloatN 4 (toFloat bal.sui / 1000000000)
                        ++ " SUI"
                    )
                , text
                    ("Mineral: "
                        ++ handleDecimals (toFloat bal.mineral / 1000000000)
                        ++ " $MINE"
                    )
                ]
                    |> column
                        [ spacing 10
                        , width fill
                        ]
              ]
                |> column
                    [ spacing 10
                    , width fill
                    , padding 10
                    , Border.width 2
                    ]
            , viewMine model wallet
            ]
                |> column
                    [ spacing 20
                    , width fill
                    ]


viewStats model =
    model.stats
        |> whenJust
            (\data ->
                data
                    |> whenJust
                        (\stats ->
                            [ [ text "Max Supply:"
                                    |> el [ Font.bold ]
                              , text "21m"
                              ]
                                |> row [ spacing 10 ]
                            , [ text "Circulating Supply:"
                                    |> el [ Font.bold ]
                              , (formatFloatN 2 (stats.totalRewards / 1000) ++ "k")
                                    |> text
                              ]
                                |> row [ spacing 10 ]
                            , [ text "Mining Output:"
                                    |> el [ Font.bold ]
                              , text "1 $MINE/min"
                              ]
                                |> row [ spacing 10 ]
                            , [ text "Total Hashes:"
                                    |> el [ Font.bold ]
                              , formatFloatN 0 (toFloat stats.totalHashes)
                                    |> text
                              ]
                                |> row [ spacing 10 ]
                            , [ text "Days Mining:"
                                    |> el [ Font.bold ]
                              , String.fromInt stats.daysMining
                                    |> text
                              ]
                                |> row [ spacing 10 ]

                            --, [ text "Remaining mining period:"
                            --|> el [ Font.bold ]
                            --, text "40yrs"
                            --]
                            --|> row [ spacing 10 ]
                            ]
                                |> column
                                    [ spacing 10
                                    , Font.size 17
                                    ]
                                |> el
                                    [ width fill
                                    ]
                        )
            )


ellipsisText : Int -> String -> Element msg
ellipsisText n txt =
    Html.div
        [ Html.Attributes.style "overflow" "hidden"
        , Html.Attributes.style "text-overflow" "ellipsis"
        , Html.Attributes.style "white-space" "nowrap"
        , Html.Attributes.style "height" <| String.fromInt n ++ "px"
        , Html.Attributes.style "display" "table-cell"
        , Html.Attributes.title txt
        ]
        [ Html.text txt
        ]
        |> Element.html
        |> el
            [ width fill
            , style "table-layout" "fixed"
            , style "display" "table"
            ]


viewManager : Model -> Wallet -> Element Msg
viewManager model wallet =
    [ wallet.balances
        |> whenJust
            (\bal ->
                [ [ text "$MINE object count:"
                        |> el [ Font.bold ]
                  , String.fromInt bal.mineralObjects
                        |> text
                  ]
                    |> row [ spacing 20 ]
                , [ text "Merge Objects"
                        |> txtBtn (Just ManageCoins)
                        |> el [ alignRight ]
                  , para [ Font.size 12 ] "Combine multiple coin objects and reclaim $SUI rent"
                  ]
                    |> row [ spacing 10 ]
                    |> when (bal.mineralObjects > 1)
                ]
                    |> column [ spacing 20 ]
            )
    , text "RETURN TO MINE"
        |> txtBtn (Just (SetView ViewMine))
        |> el [ centerX ]
    ]
        |> column [ spacing 20, width fill ]


viewMine model _ =
    [ model.miningStatus
        |> unwrap
            ([ [ img [ height <| px 25 ] "/icons/mine.png"
               , text "Start mining"
               ]
                |> row [ spacing 15, padding 10 ]
                |> txtBtn (Just Mine)
                |> el [ centerX ]
             , model.miningError
                |> whenJust
                    (para
                        [ Font.italic
                        , Font.size 15
                        , Font.center
                        ]
                    )
             , text "Or install Mining CLI"
                |> linkOut "https://github.com/ronanyeah/mineral-app/blob/master/cli/README.md"
                    [ Font.underline, centerX ]
             ]
                |> column [ centerX, spacing 20 ]
            )
            (\status ->
                let
                    txt =
                        case status of
                            SearchingForProof ->
                                "🔍 Searching for a valid proof"

                            ValidProofFound ->
                                "✅ Valid proof calculated"

                            SubmittingProof ->
                                "📡 Submitting proof"

                            WaitingForReset ->
                                "⏳ Waiting for next epoch"

                            MiningSuccess ->
                                "🏅 Mining success!"
                in
                [ let
                    progressStage =
                        case status of
                            SearchingForProof ->
                                0

                            ValidProofFound ->
                                1

                            SubmittingProof ->
                                2

                            WaitingForReset ->
                                2

                            MiningSuccess ->
                                3
                  in
                  List.range 0 3
                    |> List.map
                        (\n ->
                            el
                                [ height <| px 20
                                , width fill
                                , Background.color green
                                    |> whenAttr (n <= progressStage)
                                , Border.width 3
                                , Border.color green
                                ]
                                none
                        )
                    |> row [ width fill, spacing 20 ]
                , para [ Font.center ] txt
                , [ text "Hashes Checked:"
                        |> el [ Font.bold ]
                  , ((model.hashesChecked
                        // 1000000
                        |> String.fromInt
                     )
                        ++ "m"
                    )
                        |> text
                  ]
                    |> row [ centerX, spacing 10 ]
                    |> when (status == SearchingForProof)
                , [ spinningCog 25
                  , text "STOP"
                        |> txtBtn (Just StopMining)
                  ]
                    |> row [ spacing 10, centerX ]
                ]
                    |> column [ spacing 30, width fill ]
            )
    ]
        |> column [ spacing 20, width fill ]


navBtn : View -> String -> View -> Element Msg
navBtn v txt v_ =
    let
        active =
            v == v_
    in
    text txt
        |> btn
            (if active then
                Nothing

             else
                Just (SetView v_)
            )
            [ paddingXY 20 10
            , Font.underline
                |> whenAttr active
            ]


horizRule : Element msg
horizRule =
    el [ width fill, height <| px 2, Background.color white ] none


handleDecimals val =
    if val > 1 then
        formatFloatN 4 val

    else
        formatFloatN 9 val


footerLinks : Element msg
footerLinks =
    [ img [ height <| px 30 ] "/icons/github.png"
        |> linkOut "https://github.com/ronanyeah/mineral" []
    , img [ height <| px 30 ] "/icons/discord.png"
        |> linkOut "https://discord.com/invite/CYTsaBgEJ2" []
    , img [ height <| px 30 ] "/icons/twitter.png"
        |> linkOut "https://x.com/mineralSupply" []
    ]
        |> row [ spacing 40 ]
