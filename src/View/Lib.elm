module View.Lib exposing (..)

import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Font as Font
import Element.Input as Input
import Helpers.View exposing (style, whenAttr)
import Html.Attributes
import Img


mainFont =
    Font.family
        [ Font.typeface "IBM Plex Mono"
        ]


displayFont =
    Font.family
        [ Font.typeface "Jersey 25"
        ]


headerFont =
    Font.family
        [ Font.typeface "Oswald"
        ]


btn msg attrs elem =
    Input.button
        ((hover |> whenAttr (msg /= Nothing)) :: attrs)
        { onPress = msg
        , label = elem
        }


hover : Attribute msg
hover =
    Element.mouseOver [ fade ]


fade : Element.Attr a b
fade =
    Element.alpha 0.7


fadeIn : Attribute msg
fadeIn =
    style "animation" "fadeIn 1.5s"


pulse : Attribute msg
pulse =
    style "animation" "pulse 2s infinite"


title val =
    Html.Attributes.title val
        |> htmlAttribute


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
    btn msg btnAttrs


solidBtn msg attrs =
    btn msg
        (btnAttrs
            ++ attrs
        )


btnAttrs =
    [ Border.width 1
    , padding 5
    , Font.size 25
    , displayFont
    , Font.color black
    , Background.color white
    ]


black =
    rgb255 0 0 0


green : Color
green =
    rgb255 0 255 0


red : Color
red =
    rgb255 255 0 0


blue : Color
blue =
    rgb255 100 100 255


white =
    --rgb255 255 255 255
    rgb255 215 215 215


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


spin : Attribute msg
spin =
    style "animation" "rotation 0.7s infinite linear"
