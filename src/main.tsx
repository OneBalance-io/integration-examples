import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import "./index.css";
import { PrivyProvider } from "@privy-io/react-auth";
import { sepolia } from "viem/chains";

if (!import.meta.env.VITE_PRIVY_APP_ID)
  throw new Error("VITE_PRIVY_APP_ID is required");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PrivyProvider
      appId={import.meta.env.VITE_PRIVY_APP_ID}
      config={{
        defaultChain: sepolia,
        supportedChains: [sepolia],
        loginMethods: ["email", "wallet"],
        appearance: {
          theme: "dark",
          accentColor: "#febd66",
        },
        embeddedWallets: {
          // Create embedded wallets for users who don't have a wallet
          createOnLogin: "users-without-wallets",
        },
      }}
    >
      <App />
    </PrivyProvider>
  </StrictMode>
);
