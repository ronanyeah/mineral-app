module Utils exposing (..)

import FormatNumber
import FormatNumber.Locales exposing (usLocale)
import Ports


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
