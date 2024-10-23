module Types exposing (..)

import Dict exposing (Dict)
import Http
import Ports exposing (..)


type alias Model =
    { balance : Int
    , wallet : Maybe Wallet
    , walletInput : String
    , miningStatus : Maybe MiningStatus
    , view : View
    , exportWarning : Bool
    , showSecret : Bool
    , confirmDelete : Bool
    , tokenRefreshInProgress : Bool
    , addressInput : String
    , miningError : Maybe String
    , hashesChecked : Int
    , stats : Maybe (Maybe Ports.Stats)
    , rpcs : ( String, List String )
    , screen : Ports.Screen
    , backend : String
    , sweepView : SweepView
    , connectedWallet : Maybe String
    , time : Int
    , player : Maybe Player

    -- todo - add to player?
    , playerResult : Maybe PlayerResult
    , board : Maybe Board
    , wsConnected : Bool
    , demoMines : List Choice
    , pollingInProgress : Bool
    , spectators : Int
    , spectatorId : String
    , viewMode : ViewMode
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
    | HashCountCb Int
    | ProofSubmitError String
    | ClearWallet
    | ExportWallet
    | ToggleHide
    | RefreshTokens
    | UnsetMessage
    | ProofCb Proof
    | RetrySubmitProof ProofData
    | MiningError String
    | ManageCoins
    | StatsCb (Result Http.Error Ports.Stats)
    | Spectate
    | PollBoardCb (Result Http.Error BoardData)
    | Tick Int
    | MineCb (List Choice)
    | ConnectWallet
    | ConnectCb (Maybe String)
    | PlayerCb (Result Http.Error (Maybe Commit))
    | SubmitCb (Result Http.Error String)
    | SignedCb SignedTx
    | BoardCb BoardPort
    | JoinGame
    | WsConnectCb Bool
    | Continue
    | SelectSquare Choice Bool
    | ClaimPrize
    | SetSweepView SweepView
    | SetModeView ViewMode
    | PollingTick Int
    | CheckPlayerStatus
    | EnterAsPlayer
    | Disconnect


type ViewMode
    = ViewHome
    | ViewMiner
    | ViewSweep


type View
    = ViewMine
    | ViewManage
    | ViewSettings


type SweepView
    = SweepHome
    | SweepPlay


type MiningStatus
    = SearchingForProof
    | ValidProofFound
    | SubmittingProof
    | MiningSuccess
    | WaitingForReset


type BoardStatus
    = BoardWaiting WaitingData
    | Playing PlayingData
    | Ended


type alias WaitingData =
    { registered : Int
    , startTime : Int
    }


type alias PlayingData =
    { round : Int
    , guessCutoff : Int
    , choices : Int
    }


type alias Player =
    { commit : Maybe Commit
    , stake : Maybe Bool
    , inPlay : Bool
    }


type alias Commit =
    { game : Int
    , round : Int
    , choice : Maybe Choice
    }


type alias Board =
    { status : BoardStatus
    , game : Int
    , startingPlayers : Int
    , counts : Dict ( Int, Int ) Int
    , previousRound : Maybe RoundResult
    , previousGame : Maybe GameResult
    }


type alias RoundResult =
    { safePlayers : Int
    , eliminated : Int
    , mines : List Choice
    , counts : Dict ( Int, Int ) Int
    , status : String
    }


type alias PlayerResult =
    { outcome : PlayerOutcome
    , mines : List Choice
    , playerChoice : Maybe Choice
    , counts : Dict ( Int, Int ) Int
    , round : Int
    }


type PlayerOutcome
    = DidNotPlay
    | Survived
    | Eliminated
    | Wipeout


type alias BoardData =
    { board : List Int
    , spectators : Int
    }


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
