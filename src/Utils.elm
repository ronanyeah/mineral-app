module Utils exposing (..)

import FormatNumber
import FormatNumber.Locales exposing (usLocale)
import Http
import OpenApi.Common as OC
import Ports


convertNullable : OC.Nullable a -> Maybe a
convertNullable v =
    case v of
        OC.Null ->
            Nothing

        OC.Present a ->
            Just a


convertError : OC.Error err body -> Http.Error
convertError e =
    case e of
        OC.Timeout ->
            Http.Timeout

        OC.NetworkError ->
            Http.NetworkError

        OC.BadUrl u ->
            Http.BadUrl u

        OC.KnownBadStatus statusCode _ ->
            Http.BadStatus statusCode

        OC.UnknownBadStatus meta _ ->
            Http.BadStatus meta.statusCode

        OC.BadErrorBody meta _ ->
            Http.BadBody meta.statusText

        OC.BadBody meta _ ->
            Http.BadBody meta.statusText


boardSize : Int
boardSize =
    15


isDesktop : Ports.Screen -> Bool
isDesktop screen =
    screen.width >= 1280


minimumGasBalance : Int
minimumGasBalance =
    2500000


formatFloat : Float -> String
formatFloat =
    formatFloatN 2


formatFloatN : Int -> Float -> String
formatFloatN n =
    FormatNumber.format
        { usLocale
            | decimals = FormatNumber.Locales.Max n
        }


fork : Bool -> c -> c -> c
fork bl a b =
    if bl then
        a

    else
        b
