module Types exposing (..)

import Ports


type alias Model =
    { balance : Int
    , wallet : Maybe Wallet
    , walletInput : String
    , miningStatus : Maybe MiningStatus
    , view : View
    , claimInput : String
    , withdrawMax : Bool
    , claimStatus : ClaimStatus
    , exportWarning : Bool
    , showSecret : Bool
    , confirmDelete : Bool
    , tokenRefreshInProgress : Bool
    , addressInput : String
    , miningError : Maybe String
    , hashesChecked : Int
    , stats : Maybe (Maybe Ports.Stats)
    , swapData : Maybe Ports.SwapData
    , rpcs : ( String, List String )
    }


type Msg
    = BalancesCb (Maybe Balances)
    | WalletCb Wallet
    | MinerCreatedCb Miner
    | Mine
    | CreateWallet
    | Copy String
    | StatusCb Int
    | WalletInputCh String
    | ConfirmWallet
    | StopMining
    | SetView View
    | AddressInputCh String
    | ClaimInputCh String
    | HashCountCb Int
    | ProofSubmitError String
    | ToggleMax
    | ClaimMax
    | ClaimRes (Result String String)
    | ClearWallet
    | ExportWallet
    | ToggleHide
    | RefreshTokens
    | UnsetMessage
    | ProofCb Proof
    | RetrySubmitProof ProofData
    | MiningError String
    | StatsCb Ports.Stats
    | SwapDataCb Ports.SwapData
    | ManageCoins


type alias Flags =
    { wallet : Maybe Keypair
    , time : Int
    , rpc : ( String, List String )
    }


type View
    = ViewMine
    | ViewClaim
    | ViewSettings
    | ViewStats


type ClaimStatus
    = Standby
    | InProgress
    | Response (Result String String)


type MiningStatus
    = SearchingForProof
    | ValidProofFound
    | SubmittingProof
    | MiningSuccess
    | WaitingForReset


type alias Wallet =
    Ports.Wallet


type alias Balances =
    Ports.Balances


type alias Miner =
    Ports.Miner


type alias Keypair =
    Ports.Keypair


type alias Proof =
    Ports.Proof


type alias ProofData =
    Ports.ProofData
