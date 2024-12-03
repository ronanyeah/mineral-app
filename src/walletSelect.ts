import "@mysten/dapp-kit/dist/index.css";

import { createRoot } from "react-dom/client";
import React, { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Transaction } from "@mysten/sui/transactions";
import { WalletAccount } from "@mysten/wallet-standard";
import {
  SuiClientProvider,
  WalletProvider,
  ConnectModal,
  useCurrentAccount,
  useDisconnectWallet,
  useSignTransaction,
  useSignPersonalMessage,
  SignedPersonalMessage,
  SignedTransaction,
} from "@mysten/dapp-kit";

const WALLET_CHANGE = "walletChange";

const queryClient = new QueryClient();

export interface WalletHooks {
  currentWallet: string | null;
  signMsg?: (bts: Uint8Array) => Promise<SignedPersonalMessage>;
  setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  disconnectWallet?: () => void;
  signTx?: (txb: Transaction) => Promise<SignedTransaction>;
}

export function walletSubscribe(fn: (wallet: WalletAccount | null) => void) {
  document.addEventListener(WALLET_CHANGE, (event) => {
    const currentAccount = (<CustomEvent>event).detail.wallet;
    fn(currentAccount);
  });
}

export function init(walletHooks: WalletHooks) {
  const reactRoot = document.createElement("div");
  document.body.appendChild(reactRoot);
  const root = createRoot(reactRoot);

  root.render(React.createElement(App, { walletHooks }));
}

function App(args: { walletHooks: WalletHooks }) {
  return React.createElement(
    QueryClientProvider,
    { client: queryClient },
    React.createElement(SuiClientProvider, {
      children: React.createElement(WalletProvider, {
        children: React.createElement(WalletComponent, args),
        autoConnect: true,
      }),
    })
  );
}

function WalletComponent({ walletHooks }: { walletHooks: WalletHooks }) {
  const currentAccount = useCurrentAccount();
  const [open, setOpen] = useState(false);
  const { mutate: disconnect } = useDisconnectWallet();
  const { mutateAsync: signTransaction } = useSignTransaction();
  const { mutate: signPersonalMessage } = useSignPersonalMessage();

  useEffect(() => {
    walletHooks.signTx = (txb: Transaction) =>
      signTransaction({ transaction: txb, chain: "sui:testnet" });

    walletHooks.signMsg = (bts: Uint8Array) =>
      new Promise((resolve, reject) =>
        signPersonalMessage(
          { message: bts },
          {
            onSuccess: resolve,
            onError: reject,
          }
        )
      );

    walletHooks.disconnectWallet = disconnect;

    walletHooks.setModalOpen = setOpen;
  }, [signTransaction, signPersonalMessage, disconnect, setOpen]);

  useEffect(() => {
    walletHooks.currentWallet = currentAccount ? currentAccount.address : null;
    document.dispatchEvent(
      new CustomEvent(WALLET_CHANGE, {
        detail: { wallet: currentAccount },
      })
    );
  }, [currentAccount]);

  return React.createElement(ConnectModal, {
    trigger: React.createElement("div"),
    open: open,
    onOpenChange: setOpen,
  });
}
