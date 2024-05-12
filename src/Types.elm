module Types exposing (..)

import Ports


type alias Model =
    { balance : Int
    , wallet : Maybe Wallet
    , walletInput : String
    , miningStatus : Maybe String
    , view : View
    , claimInput : String
    , withdrawMax : Bool
    , claimStatus : ClaimStatus
    , exportWarning : Bool
    , showSecret : Bool
    , confirmDelete : Bool
    , tokenRefreshInProgress : Bool
    , persistSuccessMessage : Bool
    , addressInput : String
    , proof : Maybe Proof
    , currentTime : Int
    }


type Msg
    = BalancesCb (Maybe Balances)
    | WalletCb Keypair
    | MinerCb Miner
    | MinerCreatedCb Miner
    | Mine
    | CreateWallet
    | Copy String
    | StatusCb String
    | WalletInputCh String
    | ConfirmWallet
    | StopMining
    | SetView View
    | AddressInputCh String
    | ClaimInputCh String
    | ToggleMax
    | ClaimMax
    | ClaimRes (Result String String)
    | ClearWallet
    | ExportWallet
    | ToggleHide
    | RefreshTokens
    | UnsetMessage
    | ProofCb Proof
    | RetrySubmitProof { proof : Proof, miner : String }
    | MiningError String
    | Tick Int


type alias Flags =
    { wallet : Maybe Keypair
    , time : Int
    }


type View
    = ViewMine
    | ViewClaim


type ClaimStatus
    = Standby
    | InProgress
    | Response (Result String String)


type alias Wallet =
    { address : String
    , privateKey : String
    , balances : Maybe Balances
    , miningAccount : Maybe Miner
    }


type alias Balances =
    Ports.Balances


type alias Miner =
    Ports.Miner


type alias Keypair =
    Ports.Keypair


type alias Proof =
    Ports.Proof
