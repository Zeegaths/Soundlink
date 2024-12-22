import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from './pages/Home.jsx'
import './index.css'
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
import { providers } from "ethers";
import RapBattles from './pages/RapBattles.jsx';
import AddBattle from './pages/AddBattle.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard/>,
  },
  {
    path: "/dashboard",
    element: <Dashboard/>,
  },
  {
    path: "/profile-setup",
    element: <ProfileSetup/>,
  },
  {
    path: "/feed",
    element: <Feed/>,
  },
  {
    path: "/beats-market",
    element: <MarketPlace/>,
  },
  {
    path: "/match-beats",
    element: <Matcher/>,
  },
  {
    path: "/rap-battles",
    element: <RapBattles/>,
  },
  {
    path: "/add-battle",
    element: <AddBattle/>,
  },
]);

const config = {
  // For a production app, replace this with an Optimism Mainnet
  // RPC URL from a provider like Alchemy or Infura.
  relay: "https://relay.farcaster.xyz",
  rpcUrl: "https://mainnet.optimism.io",
  domain: "localhost:3001",
  siweUri: "localhost:3001/dashboard",
  provider: new providers.JsonRpcProvider(undefined, 10)
};


ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthKitProvider config={config}>
    <GlobalProvider>
    <RouterProvider router={router} />
    </GlobalProvider>
  </AuthKitProvider>
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>,
)
