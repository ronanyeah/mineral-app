module Utils exposing (..)

import FormatNumber
import FormatNumber.Locales exposing (usLocale)


minimumGasBalance : Int
minimumGasBalance =
    2500000


formatFloat =
    formatFloatN 2


formatFloatN n =
    FormatNumber.format
        { usLocale
            | decimals = FormatNumber.Locales.Max n
        }
