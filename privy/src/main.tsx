import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app.tsx";
import "./index.css";
import { PrivyProvider } from "@privy-io/react-auth";
import { base, sepolia } from "viem/chains";
import { ReactQueryProvider } from "./features/react-query.tsx";
import { loadRuntimeConfig } from "./get-config.ts";

loadRuntimeConfig().then((config) => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <PrivyProvider
        appId={config.VITE_PRIVY_APP_ID}
        config={{
          defaultChain: base,
          supportedChains: [sepolia, base],
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
        <ReactQueryProvider>
          <App />
        </ReactQueryProvider>
      </PrivyProvider>
    </StrictMode>
  );
});
