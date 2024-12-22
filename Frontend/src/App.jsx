import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from './pages/Home.jsx';
import './index.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Dashboard from './pages/Dashboard.jsx';
import Feed from './pages/Feed.jsx';
import MarketPlace from './pages/Marketplace.jsx';
import GlobalProvider from './context/Global/GlobalContext.jsx';
import Matcher from './pages/Matcher.jsx';
import ProfileSetup from './components/ProfileSetup.jsx';
import { AuthKitProvider, SignInButton } from '@farcaster/auth-kit';
import "@farcaster/auth-kit/styles.css";
import RapBattles from './pages/RapBattles.jsx';
import AddBattle from './pages/AddBattle.jsx';

// import { createConfig, WagmiProvider, configureChains } from 'wagmi';
// import { publicProvider } from 'wagmi/providers/public';
import { optimism } from 'wagmi/chains';

// Configure chains and provider for wagmi
// const { chains, publicClient } = configureChains(
//   [optimism], // Use Optimism mainnet
//   [publicProvider()] // Use public provider (or other RPCs)
// );

// Create a wagmi client
// const wagmiConfig = createConfig({
//   autoConnect: true,
//   publicClient,
// });

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/profile-setup",
    element: <ProfileSetup />,
  },
  {
    path: "/feed",
    element: <Feed />,
  },
  {
    path: "/beats-market",
    element: <MarketPlace />,
  },
  {
    path: "/match-beats",
    element: <Matcher />,
  },
  {
    path: "/rap-battles",
    element: <RapBattles />,
  },
  {
    path: "/add-battle",
    element: <AddBattle />,
  },
]);

const config = {
  relay: "https://relay.farcaster.xyz",
  rpcUrl: "https://mainnet.optimism.io",
  domain: "localhost:3001",
  siweUri: "localhost:3001/dashboard",
  // `wagmi` provides the public client as a replacement for `provider`
  // provider: publicClient,
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthKitProvider config={config}>
    {/* <WagmiProvider config={wagmiConfig}> */}
      <GlobalProvider>
        <RouterProvider router={router} />
      </GlobalProvider>
    {/* </WagmiProvider> */}
  </AuthKitProvider>
);
