port module Ports exposing (..)

import Json.Decode exposing (Value)


type alias Balances =
    { mineral : Int
    , sui : Int
    }


type alias Miner =
    { address : String
    , claims : Int
    }


type alias Keypair =
    { pub : String
    , pvt : String
    }


type alias Proof =
    { currentHash : List Int
    , nonce : Int
    }



-- OUT


port log : String -> Cmd msg


port copy : String -> Cmd msg


port registerMiner : () -> Cmd msg


port importWallet : Maybe String -> Cmd msg


port claim :
    { miner : String
    , amount : Int
    , recipient : String
    }
    -> Cmd msg


port submitProof : { proof : Proof, miner : String } -> Cmd msg


port mine : String -> Cmd msg


port refreshTokens : () -> Cmd msg


port stopMining : () -> Cmd msg


port clearWallet : () -> Cmd msg



-- IN


port minerAccountCb : (Miner -> msg) -> Sub msg


port minerCreatedCb : (Miner -> msg) -> Sub msg


port statusCb : (String -> msg) -> Sub msg


port miningError : (String -> msg) -> Sub msg


port balancesCb : (Maybe Balances -> msg) -> Sub msg


port walletCb : (Keypair -> msg) -> Sub msg


port claimCb : (Value -> msg) -> Sub msg


port proofCb : (Proof -> msg) -> Sub msg


port retrySubmitProof : ({ proof : Proof, miner : String } -> msg) -> Sub msg
