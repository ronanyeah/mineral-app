port module Ports exposing (..)

import Json.Decode exposing (Value)


type alias Flags =
    { wallet : Maybe Keypair
    , time : Int
    , rpc : ( String, List String )
    , spectatorId : String
    , screen : Screen
    , backend : String
    }


type alias Screen =
    { width : Int
    , height : Int
    }


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
    , totalRewards : Float
    , rewardRate : Float
    , daysMining : Int
    }


type alias ProofData =
    { proof : Proof
    , miner : String
    , coinObject : Maybe String
    }


type alias Choice =
    { x : Int
    , y : Int
    }


type alias GameResult =
    { winner : String
    , round : Int
    , ended : Int
    }


type alias SignedTx =
    { bytes : String
    , signature : String
    }


type alias BoardPort =
    { status :
        { kind : String
        , data : Value
        }
    , game : Int
    , startingPlayers : Int
    , counts : List ( ( Int, Int ), Int )
    , previousRound :
        Maybe
            { safePlayers : Int
            , eliminated : Int
            , mines : List Choice
            , counts : List ( ( Int, Int ), Int )
            , status : String
            }
    , previousGame : Maybe GameResult
    }


type alias ChoiceCount =
    { count : Int
    , choice : Choice
    }



-- OUT


port log : String -> Cmd msg


port copy : String -> Cmd msg


port registerMiner : () -> Cmd msg


port importWallet : Maybe String -> Cmd msg


port submitProof : ProofData -> Cmd msg


port mine : String -> Cmd msg


port refreshTokens : () -> Cmd msg


port stopMining : () -> Cmd msg


port clearWallet : () -> Cmd msg


port combineCoins : () -> Cmd msg


port joinGame : () -> Cmd msg


port selectSquare : { square : Choice, verify : Bool } -> Cmd msg


port connectWallet : () -> Cmd msg


port boardBytes : List Int -> Cmd msg


port claimPrize : () -> Cmd msg


port disconnect : () -> Cmd msg


port wsConnect : Bool -> Cmd msg



-- IN


port minerCreatedCb : (Miner -> msg) -> Sub msg


port statusCb : (Int -> msg) -> Sub msg


port miningError : (String -> msg) -> Sub msg


port proofSubmitError : (String -> msg) -> Sub msg


port balancesCb : (Maybe Balances -> msg) -> Sub msg


port walletCb : (Wallet -> msg) -> Sub msg


port proofCb : (Proof -> msg) -> Sub msg


port hashCountCb : (Int -> msg) -> Sub msg


port retrySubmitProof : (ProofData -> msg) -> Sub msg


port connectCb : (Maybe String -> msg) -> Sub msg


port boardCb : (BoardPort -> msg) -> Sub msg


port signedCb : (SignedTx -> msg) -> Sub msg


port wsConnectCb : (Bool -> msg) -> Sub msg
