module Types exposing (..)

import Dict exposing (Dict)
import Http
import Ports exposing (..)


type alias Model =
    { balance : Int
    , miningWallet : Maybe Wallet
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
    , sweepView : SweepView
    , connectedWallet : Maybe String
    , time : Int
    , player : Maybe Player

    -- todo - add to player?
    , playerResult : Maybe PlayerResult
    , board : Maybe Board
    , demoMines : List Choice
    , pollingInProgress : Bool
    , spectators : Int
    , spectatorId : String
    , viewMode : ViewMode

    --
    , playerAction : DataFetch
    , txInProgress : Maybe TxInProgress
    }


type TxInProgress
    = TxRegister Int
    | TxSquareSelect Int Choice


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
    | GoToBoard
    | PollBoardCb (Result Http.Error BoardData)
    | ConnectWallet
    | ConnectCb (Maybe String)
    | PlayerCb (Result Http.Error PlayerStatus)
    | TxCb (Result Http.Error Bool)
    | SubmitCb (Result Http.Error String)
    | SignedCb (Result String SignedTx)
    | BoardCb BoardPort
    | JoinGame Int String
    | SelectSquare { round : Int, coord : Choice }
    | ShowAlert String
    | ClaimPrize
    | SetSweepView SweepView
    | SetModeView ViewMode
    | PollingTick Int
    | DemoMinesTick Int
    | TimeTick Int
    | CheckPlayerStatus
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


type DataFetch
    = Ready
    | Loading
    | Fail String


type alias PlayerStatus =
    { registration : Maybe Commit
    , stake : Maybe String
    }


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
    , stake : Maybe String
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
    , prizePool : Int
    }


type alias RoundResult =
    { safePlayers : Int
    , eliminated : Int
    , mines : List Choice
    , counts : Dict ( Int, Int ) Int
    , status : RoundStatus
    }


type RoundStatus
    = RoundProceed
    | RoundWipeout
    | RoundFinal


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
