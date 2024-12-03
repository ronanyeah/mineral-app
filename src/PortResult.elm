module PortResult exposing (PortResult, parse)

import Maybe.Extra


type alias PortResult e t =
    { err : Maybe e
    , data : Maybe t
    }


parse : PortResult String t -> Result String t
parse { err, data } =
    Maybe.map Ok data
        |> Maybe.Extra.orElse (Maybe.map Err err)
        |> Maybe.withDefault (Err "Empty PortResult")
