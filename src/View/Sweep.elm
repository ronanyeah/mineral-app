module View.Sweep exposing (viewBoard, viewDash, viewDemo, viewPair)

import Dict exposing (Dict)
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Font as Font
import Element.Input as Input
import Helpers.View exposing (when, whenAttr, whenJust)
import Html.Attributes
import Img
import Maybe.Extra exposing (isJust, isNothing, unwrap)
import Ports exposing (Choice)
import Types exposing (..)
import Update exposing (validatePlayerAgainstGame)
import Utils
import View.Lib exposing (..)


viewDash : Model -> Maybe (Element Msg) -> Element Msg
viewDash model ctrl =
    [ [ logo 70
            |> el [ alignTop ]
      , [ text "MINERAL"
            |> btn (Just (SetModeView ViewHome))
                [ Font.size 70
                , displayFont
                ]
        , [ Img.mine "white" 20
          , text "MINESWEEP"
                |> el
                    [ headerFont
                    , Font.size 21
                    ]
          ]
            |> row
                [ spacing 5
                , alignRight
                , Helpers.View.style "animation" "enter 1s forwards"
                ]
        ]
            |> column [ spacing 0 ]
      ]
        |> row [ spacing 20, centerX ]
    , [ [ text "MINESWEEP"
            |> el [ headerFont, Font.size 20 ]
        , text " is a LIVE mass-multiplayer onchain game, open to all players and spectators."
        ]
            |> paragraph [ Font.center, fadeIn, Font.size 17 ]
            |> when (model.sweepView == SweepHome)
      , ctrl
            |> Maybe.withDefault (spinner 30 |> el [ centerX ])
      ]
        |> column [ spacing 30, width fill ]
    ]
        |> column
            [ spacing 20
            , paddingXY 20 0
            , height fill
            , width fill
            ]


viewPair : Model -> Board -> ( Element Msg, Element Msg )
viewPair model board =
    -- board view:
    -- if final round show last round outcome
    -- if waiting or ended show demo
    -- if spectating show current
    case model.sweepView of
        SweepHome ->
            ( viewGameStats model board
            , viewDemo model
            )

        SweepPlay ->
            case board.status of
                Playing data ->
                    model.playerResult
                        |> unwrap
                            (viewPlayPair model board data)
                            (\playerResult ->
                                ( viewPlayerResult playerResult
                                , viewBoard playerResult.mines
                                    playerResult.playerChoice
                                    playerResult.counts
                                    Nothing
                                )
                            )

                BoardWaiting _ ->
                    ( [ text "Registration open"
                      , homeBtn
                      ]
                        |> column [ spacing 30, width fill ]
                    , viewDemo model
                    )

                Ended ->
                    ( [ vGame board.game
                            |> el [ centerX ]
                      , board.previousGame
                            |> whenJust
                                (\prev ->
                                    let
                                        winTxt =
                                            if
                                                model.connectedWallet
                                                    |> unwrap False ((==) prev.winner)
                                            then
                                                text "YOU"

                                            else
                                                text (String.left 12 prev.winner)
                                                    |> linkOut
                                                        ("https://testnet.suivision.xyz/account/" ++ prev.winner)
                                                        []
                                    in
                                    [ vPair "Players:" (String.fromInt board.startingPlayers)
                                    , vPair "Final round:" ("#" ++ String.fromInt prev.round)
                                    , vPair "Ended:" (timeSince model.time prev.ended ++ " ago")
                                    , vPairRow "Winner:" winTxt
                                    ]
                                        |> column [ spacing 20 ]
                                )
                      , homeBtn
                      ]
                        |> column [ spacing 30, centerX ]
                    , if model.sweepView == SweepHome then
                        viewDemo model

                      else
                        board.previousRound
                            |> whenJust
                                (\prev ->
                                    viewBoard prev.mines
                                        Nothing
                                        prev.counts
                                        Nothing
                                )
                    )


viewPlayPair : Model -> Board -> PlayingData -> ( Element Msg, Element Msg )
viewPlayPair model board game =
    let
        isEnded =
            model.board
                |> Maybe.andThen .previousRound
                |> unwrap False (.status >> (==) RoundFinal)

        viewSpectate =
            (if Dict.isEmpty board.counts then
                board.previousRound

             else
                Nothing
            )
                |> unwrap
                    (viewBoard [] Nothing board.counts Nothing)
                    (\prev ->
                        viewBoard prev.mines
                            Nothing
                            prev.counts
                            Nothing
                    )

        vChoice { x, y } =
            vPair "You chose:"
                ("["
                    ++ String.fromInt (x + 1)
                    ++ ", "
                    ++ String.fromInt (y + 1)
                    ++ "]"
                )
                |> el [ padding 10, Border.width 1 ]

        ( canPlay, currentPlayerChoice ) =
            model.player
                |> Maybe.andThen .commit
                |> unwrap ( False, Nothing )
                    (\com ->
                        ( validatePlayerAgainstGame game com board
                        , currentChoice board com
                        )
                    )
    in
    ( -- in play view
      -- players can have a result
      -- players can have a stale player obj
      -- players can become stale
      -- if stale need to show spectate
      if isEnded then
        let
            youWon =
                Maybe.map2
                    (\prev ch ->
                        -- is wipeout
                        (prev.safePlayers == 0)
                            || not (List.member ch prev.mines)
                    )
                    board.previousRound
                    currentPlayerChoice
        in
        viewFinalRound board.game model.playerAction game.round youWon

      else
        [ viewPlayingCtrl
            model
            board
            game
        , if canPlay then
            currentPlayerChoice
                |> unwrap
                    (text "Choose a square ➡"
                        |> el
                            [ headerFont
                            , pulse
                            , Font.bold
                            , Font.size 28
                            ]
                    )
                    vChoice
                |> el [ centerX ]

          else
            text "[Spectator Mode]"
                |> el [ centerX, pulse, displayFont, Font.size 27 ]
        ]
            |> column [ width fill, spacing 30 ]
    , if isEnded then
        board.previousRound
            |> whenJust
                (\prev ->
                    viewBoard prev.mines
                        currentPlayerChoice
                        prev.counts
                        Nothing
                )

      else if canPlay then
        viewBoard []
            currentPlayerChoice
            board.counts
            (if isNothing currentPlayerChoice && model.playerAction /= Loading then
                (\coord ->
                    let
                        isSelected =
                            Dict.member ( coord.x, coord.y ) board.counts

                        playerCount =
                            currentPlayers board
                    in
                    if playerCount <= 5 && isSelected then
                        ShowAlert "Choose a different square."

                    else
                        SelectSquare
                            { round = game.round
                            , coord = coord
                            }
                )
                    |> Just

             else
                Nothing
            )

      else
        viewSpectate
    )


viewFinalRound : Int -> DataFetch -> Int -> Maybe Bool -> Element Msg
viewFinalRound game status round playerResult =
    [ vGame game
        |> el [ centerX ]
    , para [ Font.center ] ("Game has ended in Round #" ++ String.fromInt round ++ "!")
    , playerResult
        |> unwrap
            ([ [ para [ Font.center ] "Waiting for winner to claim prize"
               , spinner 30
                    |> el [ centerX ]
               ]
                |> column [ width fill, spacing 20 ]
             , homeBtn
             ]
                |> column [ spacing 30 ]
            )
            (\youWon ->
                if youWon then
                    [ text "You won!"
                        |> el [ pulse, centerX, Font.bold, Font.size 30 ]
                    , [ Img.sui "black" 20
                      , text "Claim prize"
                      ]
                        |> row [ spacing 10, paddingXY 15 0 ]
                        |> loadingBtn status
                            (Just ClaimPrize)
                            [ centerX
                            ]
                    ]
                        |> column [ spacing 20, centerX ]

                else
                    [ para [ Font.center ] "You lost."
                    , para [ Font.center ] "Better luck next time."
                    , homeBtn
                    ]
                        |> column [ spacing 20 ]
            )
    ]
        |> column [ spacing 20, centerX ]


viewPlayerResult : PlayerResult -> Element Msg
viewPlayerResult res =
    [ vRound res.round
        |> el [ centerX ]
    , case res.outcome of
        Wipeout ->
            [ text "Wipeout!"
                |> el
                    [ Font.color red
                    , headerFont
                    , pulse
                    , Font.bold
                    , Font.size 32
                    ]
            , text "All players proceed."
                |> el [ Font.size 15 ]
            , text "NEXT ROUND ➡"
                |> solidBtn (Just GoToBoard) [ centerX ]
            ]
                |> column [ spacing 10 ]

        DidNotPlay ->
            [ "You did not play, and were eliminated."
                |> para
                    [ headerFont
                    , Font.bold
                    , Font.size 32
                    ]
            , text "Continue as spectator"
                |> solidBtn (Just GoToBoard) [ centerX ]
            ]
                |> column [ spacing 20 ]

        Survived ->
            [ text "You survived!"
                |> el
                    [ Font.color green
                    , headerFont
                    , pulse
                    , Font.bold
                    , Font.size 32
                    ]
            , text "NEXT ROUND ➡"
                |> solidBtn (Just GoToBoard) [ centerX ]
            ]
                |> column [ spacing 20 ]

        Eliminated ->
            [ text "You were hit!"
                |> el
                    [ Font.color red
                    , headerFont
                    , pulse
                    , Font.bold
                    , Font.size 32
                    , centerX
                    ]
            , text "Continue as spectator"
                |> solidBtn (Just GoToBoard) [ centerX ]
            ]
                |> column [ spacing 20 ]
    ]
        |> column [ spacing 30, centerX ]


viewPlayingCtrl : Model -> Board -> PlayingData -> Element Msg
viewPlayingCtrl model board data =
    let
        overtime =
            model.time >= data.guessCutoff

        players =
            currentPlayers board
    in
    [ [ vRound data.round
      , vPair "Spectators:"
            (model.spectators
                - players
                |> max 0
                |> String.fromInt
            )
      ]
        |> row [ width fill, spaceEvenly ]
    , if overtime then
        [ text "Selection has ended"
            |> el
                [ Font.color blue
                , displayFont
                , centerX
                , pulse
                , Font.size 30
                ]
        , [ text "Waiting for results", spinner 24 ]
            |> row
                [ spacing 10
                , headerFont
                , Font.bold
                , centerX
                , Font.size 25
                ]
        ]
            |> column [ spacing 10, centerX ]

      else
        text "Game in progress"
            |> el [ centerX, Font.color green, displayFont, Font.size 30, pulse ]
    , [ vPair "Remaining time:"
            (secondsDifference model.time data.guessCutoff)
      , board.previousRound
            |> unwrap board.startingPlayers
                .safePlayers
            |> (\val ->
                    vPair "Players remaining:"
                        (String.fromInt val)
               )
      , vPair "Current choices:"
            (String.fromInt data.choices)
      ]
        |> column [ spacing 10 ]
    , board.previousRound
        |> whenJust
            (\prev ->
                [ text ("Round " ++ String.fromInt (data.round - 1) ++ " outcome:")
                    |> el [ Font.bold, Font.size 20 ]
                , vPair "Eliminated:"
                    (String.fromInt
                        prev.eliminated
                    )
                , [ vPair "Mines:"
                        (String.fromInt
                            (List.length prev.mines)
                        )
                  ]
                    |> column [ spacing 10 ]
                ]
                    |> column
                        [ spacing 10
                        , Border.width 1
                        , width fill
                        , padding 10
                        ]
            )
    ]
        |> column [ spacing 30, width fill ]


viewGameStats : Model -> Board -> Element Msg
viewGameStats model board =
    let
        spectateButton =
            [ text "👁"
            , text "Join as spectator"
            ]
                |> row [ spacing 10, paddingXY 15 0 ]
                |> solidBtn (Just GoToBoard) [ centerX ]
    in
    [ [ text ("Game #" ++ String.fromInt board.game)
            |> vHeader
            |> el [ centerX ]
      , case board.status of
            BoardWaiting data ->
                [ vPair "Starting in:"
                    (timeDifference model.time data.startTime)
                    |> el [ title "21:00 UTC - 03 DEC" ]
                , vPair "Registered players:"
                    (String.fromInt data.registered)
                , vPair "Prize:"
                    --(String.fromInt board.prizePool)
                    "1000 $DEEP"
                , vPair "Chain:"
                    --(String.fromInt board.prizePool)
                    "sui:testnet"
                ]
                    |> column [ spacing 20, width fill ]

            Playing data ->
                [ text "In progress"
                    |> el [ centerX, Font.color green, displayFont, Font.size 30, pulse ]
                , vPair "Current round:"
                    ("#" ++ String.fromInt data.round)
                    |> el [ centerX ]
                , vPair "Active players:"
                    (String.fromInt <| currentPlayers board)
                    |> el [ centerX ]
                ]
                    |> column [ spacing 20, width fill ]

            Ended ->
                [ para [ Font.center ] "This game has ended. Stay tuned for the next one."
                , [ text "👁"
                  , text "View results"
                  ]
                    |> row [ spacing 10, paddingXY 15 0 ]
                    |> solidBtn (Just GoToBoard) [ centerX ]

                --, vPair "Winner:" (String.left 12 data.winner)
                ]
                    |> column [ spacing 20, centerX ]
      ]
        |> column
            [ Border.width 2
            , padding 20
            , width fill
            , spacing 15
            ]
    , model.connectedWallet
        |> unwrap
            (case board.status of
                BoardWaiting _ ->
                    [ text "[Player Registration]"
                        |> el [ centerX, mainFont ]
                    , [ Img.sui "black" 20
                      , text "Connect wallet"
                      ]
                        |> row [ spacing 10, paddingXY 15 0 ]
                        |> solidBtn (Just ConnectWallet) [ centerX ]
                    ]
                        |> column [ spacing 20, centerX ]

                Playing _ ->
                    [ spectateButton
                    , text "Did you register?"
                        |> el [ centerX ]
                    , [ Img.sui "black" 20
                      , text "Connect wallet"
                      ]
                        |> row [ spacing 10, paddingXY 15 0 ]
                        |> solidBtn (Just ConnectWallet) [ centerX ]
                    ]
                        |> column [ spacing 20, centerX ]

                Ended ->
                    none
            )
            (\w ->
                [ [ [ text "Wallet:"
                        |> el [ Font.bold ]
                    , text (String.left 9 w)
                        |> linkOut ("https://testnet.suivision.xyz/account/" ++ w)
                            [ Font.underline ]
                    ]
                        |> row [ spacing 10 ]
                  , text "X"
                        |> btn (Just Disconnect) [ alignRight ]
                  ]
                    |> row [ width fill ]
                , case board.status of
                    BoardWaiting _ ->
                        model.player
                            |> unwrap
                                (case model.playerAction of
                                    Ready ->
                                        spinner 30
                                            |> el [ centerX ]

                                    Fail e ->
                                        para [ Font.italic ] e

                                    Loading ->
                                        spinner 30
                                            |> el [ centerX ]
                                )
                                (\p ->
                                    let
                                        isRegistered =
                                            p.commit
                                                |> unwrap
                                                    False
                                                    (\commit ->
                                                        commit.game
                                                            == board.game
                                                            && isNothing commit.choice
                                                            && commit.round
                                                            == 1
                                                    )
                                    in
                                    if isRegistered then
                                        [ [ text "✅  Registered"
                                          ]
                                            |> row [ spacing 10, paddingXY 10 5 ]
                                            |> solidBtn
                                                Nothing
                                                [ centerX ]
                                        , [ para [ Font.center ] "Minesweep will start on time, and will be played LIVE."
                                          , para [ Font.center ] "Be ready."
                                          ]
                                            |> column [ spacing 10, centerX, Font.size 17 ]
                                        ]
                                            |> column [ spacing 10, centerX ]

                                    else
                                        [ [ Img.mine "black" 20, text "Register to play" ]
                                            |> row [ spacing 10 ]
                                            |> loadingBtn model.playerAction
                                                (p.stake
                                                    |> Maybe.map (JoinGame board.game)
                                                )
                                                [ centerX
                                                ]
                                        , "Registration and gameplay requires testnet $SUI."
                                            |> para [ Font.size 17, Font.italic, Font.center ]

                                        --, "Requires holding a $MINE balance."
                                        --|> para [ Font.size 17, Font.italic, Font.center ]
                                        , "Minesweep is played LIVE, so ensure you are available at the above start time."
                                            |> para [ Font.size 17, Font.italic, Font.center ]
                                        ]
                                            |> column [ spacing 15, centerX ]
                                )

                    Playing data ->
                        model.player
                            |> unwrap
                                ([ spinner 30 |> el [ centerX ]

                                 --, text "Check player status"
                                 --|> solidBtn (Just CheckPlayerStatus) [ centerX ]
                                 ]
                                    |> column [ spacing 10, centerX ]
                                )
                                (\p ->
                                    let
                                        canPlay =
                                            p.commit
                                                |> unwrap False
                                                    (\com ->
                                                        validatePlayerAgainstGame data com board
                                                    )
                                    in
                                    if canPlay then
                                        [ text "Join game"
                                            |> solidBtn
                                                (if isNothing p.stake then
                                                    Nothing

                                                 else
                                                    Just GoToBoard
                                                )
                                                [ centerX ]
                                        , "Requires holding a $MINE balance."
                                            |> para [ Font.size 17, Font.italic, Font.center ]
                                        ]
                                            |> column [ spacing 10, centerX ]

                                    else
                                        [ --text "Not eligible"
                                          --|> el [ centerX ]
                                          spectateButton
                                        ]
                                            |> column [ width fill, spacing 20 ]
                                )

                    Ended ->
                        none
                ]
                    |> column
                        [ width fill
                        , spacing 20
                        , Border.width 2
                        , padding 10
                        ]
            )
        |> when (board.status /= Ended)
    ]
        |> column [ spacing 20, width fill ]


viewBoard : List Choice -> Maybe Choice -> Dict ( Int, Int ) Int -> Maybe (Choice -> Msg) -> Element Msg
viewBoard mines playerSelection counts selectMsg =
    let
        sp =
            4

        showChoiceCount =
            List.isEmpty mines
                |> not
    in
    squares
        |> List.map
            (List.map
                (\({ x, y } as coord) ->
                    let
                        size =
                            44

                        choiceCount =
                            Dict.get ( x, y ) counts

                        isMine =
                            List.member coord mines
                    in
                    Input.button
                        [ height <| px size
                        , width <| px size
                        , Background.color
                            (if isMine then
                                red

                             else if Just coord == playerSelection then
                                green

                             else if isJust choiceCount then
                                blue

                             else
                                lightGrey
                            )
                        , Img.mine "black"
                            30
                            |> el
                                [ centerX
                                , centerY
                                , fadeIn
                                ]
                            |> inFront
                            |> whenAttr
                                (isMine && isNothing choiceCount)
                        , choiceCount
                            |> whenJust
                                (\c ->
                                    text
                                        (String.fromInt c)
                                        |> el
                                            [ padding 5
                                            , Background.color black
                                            , Font.color white
                                            , centerY
                                            , centerX
                                            , Font.size 19
                                            ]
                                )
                            |> when showChoiceCount
                            |> inFront
                        , coordAttr coord
                        , hover
                            |> whenAttr (isJust selectMsg)
                        ]
                        { onPress =
                            selectMsg
                                |> Maybe.map (\fn -> fn coord)
                        , label = none
                        }
                )
                >> row [ spacing sp ]
            )
        |> column
            [ width fill
            , height fill
            , spacing sp
            ]
        |> el
            [ alignTop
            ]


squares =
    List.range 0 (Utils.boardSize - 1)
        |> List.reverse
        |> List.map
            (\y ->
                List.range 0 (Utils.boardSize - 1)
                    |> List.map
                        (\x ->
                            { x = x, y = y }
                        )
            )


viewDemo : Model -> Element Msg
viewDemo model =
    let
        sp =
            4
    in
    squares
        |> List.map
            (List.map
                (\coord ->
                    let
                        size =
                            44

                        isDemoMine =
                            List.member coord model.demoMines
                    in
                    el
                        [ height <| px size
                        , width <| px size
                        , Background.color lightGrey
                        , Img.mine "black"
                            30
                            |> el
                                [ centerX
                                , centerY
                                , fadeIn
                                ]
                            |> inFront
                            |> whenAttr isDemoMine
                        , coordAttr coord
                        , hover
                        ]
                        none
                )
                >> row [ spacing sp ]
            )
        |> column
            [ width fill
            , height fill
            , spacing sp
            ]
        |> el
            [ alignTop
            ]


timeDifference : Int -> Int -> String
timeDifference now start =
    if start <= now then
        "NOW"

    else
        let
            diff =
                start - now

            seconds =
                diff // 1000

            minutes =
                seconds // 60

            hours =
                minutes // 60

            days =
                hours // 24
        in
        if days > 1 then
            String.fromInt days
                ++ " days"

        else if hours > 1 then
            String.fromInt hours
                ++ " hours"

        else if minutes > 1 then
            String.fromInt minutes
                ++ " minutes"

        else
            String.fromInt seconds
                ++ (if seconds == 1 then
                        " second"

                    else
                        " seconds"
                   )


timeSince : Int -> Int -> String
timeSince now start =
    let
        diff =
            now - start

        seconds =
            diff // 1000

        minutes =
            seconds // 60

        hours =
            minutes // 60

        days =
            hours // 24
    in
    if days > 0 then
        String.fromInt days
            ++ (if days == 1 then
                    " day"

                else
                    " days"
               )

    else if hours > 0 then
        String.fromInt hours
            ++ (if hours == 1 then
                    " hour"

                else
                    " hours"
               )

    else if minutes > 0 then
        String.fromInt minutes
            ++ (if minutes == 1 then
                    " minute"

                else
                    " minutes"
               )

    else
        String.fromInt seconds
            ++ (if seconds == 1 then
                    " second"

                else
                    " seconds"
               )


secondsDifference : Int -> Int -> String
secondsDifference now start =
    if start <= now then
        "0s"

    else
        let
            diff =
                start - now

            seconds =
                diff // 1000
        in
        String.fromInt seconds ++ "s"


lightGrey =
    rgba255 195 195 195 0.65


coordAttr { x, y } =
    Html.Attributes.title
        ("[ "
            ++ String.fromInt (x + 1)
            ++ ", "
            ++ String.fromInt (y + 1)
            ++ " ]"
        )
        |> htmlAttribute


currentChoice board player =
    case board.status of
        Playing data ->
            if player.round == data.round && board.game == player.game then
                player.choice

            else
                Nothing

        _ ->
            Nothing


currentPlayers board =
    case board.status of
        Playing _ ->
            board.previousRound
                |> unwrap
                    board.startingPlayers
                    .safePlayers

        BoardWaiting data ->
            data.registered

        Ended ->
            0


vPair k v =
    [ text k
        |> el [ Font.bold ]
    , text v
    ]
        |> row [ spacing 10 ]


vPairRow k v =
    [ text k
        |> el [ Font.bold ]
    , v
    ]
        |> row [ spacing 10 ]


vGame n =
    text ("Game #" ++ String.fromInt n)
        |> vHeader


vRound n =
    text ("Round #" ++ String.fromInt n)
        |> el [ Font.size 30, Font.bold, headerFont ]


homeBtn =
    text "Continue"
        |> solidBtn (Just <| SetSweepView SweepHome) [ centerX ]


vHeader =
    el [ Font.size 40, Font.bold, headerFont ]


loadingBtn status msg attrs =
    solidBtn
        (if status == Loading then
            Nothing

         else
            msg
        )
        (attrs
            ++ [ spinner 20
                    |> el [ centerY, paddingXY 10 0 ]
                    |> onRight
                    |> whenAttr (status == Loading)
               ]
        )
