port module Ports exposing (..)

import Json.Decode exposing (Value)


type alias Wallet =
    { address : String
    , privateKey : String
    , balances : Maybe Balances
    , miningAccount : Maybe Miner
    }


type alias Balances =
    { mineral : Int
    , sui : Int
    , mineralObjects : Int
    , coinObject : Maybe String
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


type alias Stats =
    { totalHashes : Int
    , totalRewards : Int
    , rewardRate : Int
    }


type alias SwapData =
    { mineGasFee : Float
    , swapOutput : Float
    , delta : Float
    }


type alias ProofData =
    { proof : Proof
    , miner : String
    , coinObject : Maybe String
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


port submitProof : ProofData -> Cmd msg


port mine : String -> Cmd msg


port refreshTokens : () -> Cmd msg


port fetchStats : () -> Cmd msg


port stopMining : () -> Cmd msg


port clearWallet : () -> Cmd msg


port combineCoins : () -> Cmd msg



-- IN


port minerCreatedCb : (Miner -> msg) -> Sub msg


port statusCb : (Int -> msg) -> Sub msg


port miningError : (String -> msg) -> Sub msg


port proofSubmitError : (String -> msg) -> Sub msg


port balancesCb : (Maybe Balances -> msg) -> Sub msg


port walletCb : (Wallet -> msg) -> Sub msg


port claimCb : (Value -> msg) -> Sub msg


port proofCb : (Proof -> msg) -> Sub msg


port hashCountCb : (Int -> msg) -> Sub msg


port statsCb : (Stats -> msg) -> Sub msg


port swapDataCb : (SwapData -> msg) -> Sub msg


port retrySubmitProof : (ProofData -> msg) -> Sub msg
