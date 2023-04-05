import React from "react";
import Routing from "./Routing";
import { ProfileProvider } from "./context/ProfileProvider";
import Loading from "./customComponent/Loading";
import LoaderHelper from "./customComponent/Loading/LoaderHelper";
import {
  connectorsForWallets,
  darkTheme,
  lightTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";

import {
  chain,
  configureChains,
  createClient,
  useNetwork,
  useProvider,
  useSigner,
  WagmiConfig,
} from "wagmi";

import { infuraProvider } from "wagmi/providers/infura";

import {
  injectedWallet,
  rainbowWallet,
  walletConnectWallet,
  metaMaskWallet,
  ledgerWallet,
  argentWallet,
  braveWallet,
  coinbaseWallet,
  imTokenWallet,
  trustWallet,
  omniWallet,
} from "@rainbow-me/rainbowkit/wallets";

import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

const bsc = {
  id: 56,
  name: "BSC",
  network: "BNB Smartchain",
  nativeCurrency: {
    decimals: 18,
    name: "BNB",
    symbol: "BNB",
  },
  rpcUrls: {
    default: "https://bsc-dataseed2.defibit.io",
  },
  blockExplorers: {
    default: { name: "BscScan", url: "https://bscscan.com" },
  },
  testnet: false,
};

const bscTestnet = {
  id: 97,
  name: "BSC Testnet",
  network: "BNB Smartchain Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "BNB",
    symbol: "BNB",
  },
  rpcUrls: {
    default: "https://data-seed-prebsc-1-s1.binance.org:8545/",
  },
  blockExplorers: {
    default: { name: "BscScan", url: "https://testnet.bscscan.com" },
  },
  testnet: true,
};

const { chains, provider } = configureChains(
  [bscTestnet],
  [
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id !== bscTestnet.id) return null;
        return { http: chain.rpcUrls.default };
      },
    }),
  ]
);

// connect for wallets

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      injectedWallet({ chains }),
      rainbowWallet({ chains }),
      walletConnectWallet({ chains }),
      metaMaskWallet({ chains }),
      ledgerWallet({ chains }),
      argentWallet({ chains }),
      braveWallet({ chains }),
      coinbaseWallet({ chains }),
      imTokenWallet({ chains }),
      trustWallet({ chains }),
      omniWallet({ chains }),
    ],
  },
]);

const client = createClient({
  autoConnect: false,
  connectors,
  provider,
});

function App() {
  return (
    <WagmiConfig client={client}>
      <RainbowKitProvider chains={chains}>
        <ProfileProvider>
          <Routing />
          <Loading ref={ref => LoaderHelper.setLoader(ref)} />
        </ProfileProvider>
      </RainbowKitProvider>
    </WagmiConfig>  
  );
}

export default App;
