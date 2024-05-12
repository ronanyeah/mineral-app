module View exposing (view)

import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Font as Font
import Element.Input as Input
import Helpers.View exposing (cappedWidth, style, when, whenAttr, whenJust)
import Html exposing (Html)
import Html.Attributes
import Img
import Maybe.Extra exposing (unwrap)
import Types exposing (..)
import Utils exposing (..)


startTime =
    1715534935000


view : Model -> Html Msg
view model =
    [ [ logo 70
      , text "MINERAL"
            |> el [ Font.size 70, displayFont ]
      ]
        |> row [ spacing 20, centerX ]
    , [ text "Proof of Work"
            |> el [ Font.size 17, width <| px 140 ]
      , text "|"
            |> el [ Font.size 25 ]
      , img [ height <| px 30, centerX ] "/sui.png"
            |> el [ width <| px 140 ]
      ]
        |> row [ spacing 10, centerX ]
        |> when False
    , if startTime < model.currentTime then
        viewBody model

      else
        [ [ Img.x 20
          , text ".com/MineralSupply"
                |> el [ Font.size 22 ]
          ]
            |> row []
            |> linkOut "https://twitter.com/MineralSupply" []
        , timeDifference model.currentTime startTime
            |> (\( hours, mins, seconds ) ->
                    [ String.padLeft 2 '0' (String.fromInt hours)
                    , ":"
                    , String.padLeft 2 '0' (String.fromInt mins)
                    , ":"
                    , String.padLeft 2 '0' (String.fromInt seconds)
                    ]
                        |> String.concat
               )
            |> text
            |> el [ Font.size 50, centerX ]
        ]
            |> column [ centerX, spacing 20 ]
    ]
        |> column
            [ cappedWidth 450
            , centerX
            , height fill
            , padding 20
            , spacing 20
            , scrollbarY
            ]
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
                                (.sui >> (==) 0)
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
                                |> linkOut ("https://suiscan.xyz/testnet/account/" ++ wallet.address) [ Font.underline ]
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
                            [ spacing 20
                            , width fill
                            ]
                    , [ navBtn model.view "Mine" ViewMine
                      , navBtn model.view "Claim" ViewClaim
                      ]
                        |> row [ centerX, spacing 20 ]
                        |> when (not balanceEmpty)
                        |> when False
                    ]
                        |> column
                            [ width fill
                            , height fill
                            , spacing 20
                            ]
            )


viewDash model wallet bal =
    let
        claimableRewards =
            wallet.miningAccount
                |> unwrap False (\m -> m.claims > 0)

        claimable =
            [ [ text "Unclaimed Rewards"
                    |> el [ Font.bold ]
              ]
                |> row [ spaceEvenly, width fill ]
            , [ ((wallet.miningAccount
                    |> Maybe.andThen
                        (\acc ->
                            if acc.claims == 0 then
                                Nothing

                            else
                                Just acc.claims
                        )
                    |> unwrap "0.00"
                        (\val ->
                            formatFloatN 8 (toFloat val / 1000000000)
                        )
                 )
                    ++ " $MINE"
                )
                    |> text
              , text "Claim"
                    |> txtBtn (Just (SetView ViewClaim))
                    |> when
                        (claimableRewards
                            && model.view
                            == ViewMine
                            && model.miningStatus
                            == Nothing
                        )
              ]
                |> row [ width fill, spaceEvenly ]
            ]
                |> column
                    [ spacing 10
                    , width fill
                    , padding 10
                    , Border.width 2
                    ]
                |> when False
    in
    if model.view == ViewClaim then
        [ claimable
        , Input.text
            [ width fill
            , Font.color black
            , Border.rounded 0
            ]
            { onChange = AddressInputCh
            , placeholder = Just <| Input.placeholder [] <| text "Wallet address"
            , text = model.addressInput
            , label = Input.labelHidden ""
            }
        , Input.text
            [ width fill
            , Font.color black
            , Border.rounded 0
            ]
            { onChange = ClaimInputCh
            , placeholder = Just <| Input.placeholder [] <| text "Claim amount"
            , text = model.claimInput
            , label =
                text "MAX"
                    |> txtBtn (Just ToggleMax)
                    |> Input.labelRight []
            }
        , let
            inProg =
                model.claimStatus == InProgress
          in
          [ text "Claim"
                |> txtBtn (fork inProg Nothing (Just ClaimMax))
          , spinner 20
                |> when inProg
          ]
            |> row
                [ spacing 10
                , centerX
                ]
        , case model.claimStatus of
            Response (Ok val) ->
                text "Success"
                    |> linkOut ("https://testnet.suivision.xyz/txblock/" ++ val) [ Font.underline ]

            Response (Err val) ->
                para
                    [ Html.Attributes.style "word-break" "break-all"
                        |> htmlAttribute
                    ]
                    ("Error: " ++ val)

            _ ->
                none
        , horizRule
        , text "RETURN TO MINES"
            |> txtBtn (Just (SetView ViewMine))
            |> el [ centerX ]
        ]
            |> column [ spacing 20, width fill ]

    else
        [ [ [ text "Balances"
                |> el [ Font.bold ]
            , text "Refresh"
                |> btn
                    (if model.tokenRefreshInProgress then
                        Nothing

                     else
                        Just RefreshTokens
                    )
                    [ Font.underline, Font.size 15 ]
                |> when False
            ]
                |> row [ spaceEvenly, width fill ]
          , [ text
                ("Sui: "
                    ++ formatFloatN 4 (toFloat bal.sui / 1000000000)
                    ++ " SUI"
                )
            , text
                ("Mineral: "
                    ++ formatFloatN 9 (toFloat bal.mineral / 1000000000)
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
        , claimable
        , viewMine model wallet
        ]
            |> column
                [ spacing 20
                , width fill
                ]


viewMine model wallet =
    [ model.miningStatus
        |> unwrap
            ([ img [ height <| px 25 ] "/icons/mine.png"
             , text "Start mining"
             ]
                |> row [ spacing 15, padding 10 ]
                |> txtBtn (Just Mine)
                |> el [ centerX ]
            )
            (\status ->
                let
                    stage =
                        if model.persistSuccessMessage then
                            3

                        else
                            case status of
                                "1" ->
                                    0

                                "2" ->
                                    1

                                "3" ->
                                    2

                                _ ->
                                    3

                    txt =
                        case stage of
                            0 ->
                                "🔍 Searching for a valid proof"

                            1 ->
                                "✅ Valid proof calculated"

                            2 ->
                                "📡 Submitting claim"

                            _ ->
                                "🏅 Mining success!"
                in
                [ List.range 0 3
                    |> List.map
                        (\n ->
                            el
                                [ height <| px 20
                                , width fill
                                , Background.color green
                                    |> whenAttr (n <= stage)
                                , Border.width 3
                                , Border.color green
                                ]
                                none
                        )
                    |> row [ width fill, spacing 20 ]
                , para [ Font.center ] txt
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


mainFont =
    Font.family
        [ Font.typeface "IBM Plex Mono"
        ]


displayFont =
    Font.family
        [ Font.typeface "Jersey 25"
        ]


btn msg attrs elem =
    Input.button
        ([ hover |> whenAttr (msg /= Nothing) ] ++ attrs)
        { onPress = msg
        , label = elem
        }


hover : Attribute msg
hover =
    Element.mouseOver [ fade ]


fade : Element.Attr a b
fade =
    Element.alpha 0.7


title val =
    Html.Attributes.title val
        |> htmlAttribute


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


spinner : Int -> Element msg
spinner n =
    Img.notch n
        |> el
            [ spin
            ]


spinningCog : Int -> Element msg
spinningCog n =
    img [ width <| px n ] "/icons/cog.png"
        |> el
            [ style "animation" "rotation 3s infinite linear"
            ]


spin =
    style "animation" "rotation 0.7s infinite linear"


fork bl a b =
    if bl then
        a

    else
        b


black =
    rgb255 0 0 0


green : Color
green =
    rgb255 0 255 0


white =
    --rgb255 255 255 255
    rgb255 215 215 215


para attrs val =
    paragraph attrs [ text val ]


linkOut url attrs elem =
    newTabLink
        (hover :: attrs)
        { url = url
        , label = elem
        }


logo size =
    Img.logo size


img attrs url =
    image attrs
        { src = url
        , description = ""
        }


hideText txt =
    List.repeat (String.length txt) '•'
        |> String.fromList


txtBtn msg =
    btn msg
        [ Border.width 1
        , padding 5
        , Font.size 25
        , displayFont
        , Font.color black
        , Background.color white
        ]


horizRule =
    el [ width fill, height <| px 2, Background.color white ] none


timeDifference : Int -> Int -> ( Int, Int, Int )
timeDifference timestamp1 timestamp2 =
    let
        diffMillis =
            abs (timestamp1 - timestamp2)

        totalSeconds =
            diffMillis // 1000

        hours =
            totalSeconds // 3600

        remainingSecondsAfterHours =
            modBy 3600 totalSeconds

        minutes =
            remainingSecondsAfterHours // 60

        seconds =
            modBy 60 remainingSecondsAfterHours
    in
    ( hours, minutes, seconds )
