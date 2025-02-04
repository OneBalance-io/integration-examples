import { Authenticated } from "@/features/authenticated";
import { Balances } from "@/features/balances/balances-ui";
import { EnvironmentProvider } from "@/features/environment/environment";
import { OneBalanceAccountRequired } from "@/features/onebalance-account/onebalance-account-required";
import { Swap } from "@/features/swap/swap-ui";
import { TransactionHistory } from "@/features/transaction-history/transaction-history-ui";
import { Transfer } from "@/features/transfer/transfer-ui";
import { Header } from "@/features/ui/header";
import { Login } from "@/features/ui/login";
import * as Tabs from "@radix-ui/react-tabs";
import localFont from "next/font/local";

const Pangram = localFont({
  src: [
    {
      path: "../features/fonts/Pangram-Black-900.woff",
      weight: "900",
      style: "normal",
    },
    {
      path: "../features/fonts/Pangram-ExtraBold-800.woff",
      weight: "800",
      style: "normal",
    },
    {
      path: "../features/fonts/Pangram-Bold-700.woff",
      weight: "700",
      style: "normal",
    },
    {
      path: "../features/fonts/Pangram-Medium-500.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "../features/fonts/Pangram-Regular-400.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../features/fonts/Pangram-Light-300.woff",
      weight: "300",
      style: "normal",
    },
    {
      path: "../features/fonts/Pangram-ExtraLight-200.woff",
      weight: "200",
      style: "normal",
    },
  ],
});

export default function Home() {
  return (
    <EnvironmentProvider
      apiKey={process.env.PUBLIC_ONEBALANCE_API_KEY!}
      apiUrl={process.env.PUBLIC_ONEBALANCE_API!}
    >
      <Tabs.Root
        defaultValue="balances"
        className="flex-1 flex flex-col items-center"
      >
        <Header />
        <main
          className={`max-w-screen-xl ${Pangram.className} flex-1 flex w-full`}
        >
          <Authenticated unauthenticated={<Login />}>
            <div className="mt-16 w-full text-center">
              <h1 className="text-5xl">Welcome</h1>

              <OneBalanceAccountRequired>
                <div className="mt-8">
                  <div className="mt-4">
                    <Tabs.Content value="balances">
                      <Balances />
                    </Tabs.Content>
                    <Tabs.Content value="swap">
                      <Swap />
                    </Tabs.Content>
                    <Tabs.Content value="transfer">
                      <Transfer />
                    </Tabs.Content>
                    <Tabs.Content value="history">
                      <TransactionHistory />
                    </Tabs.Content>
                  </div>
                </div>
              </OneBalanceAccountRequired>
            </div>
          </Authenticated>
        </main>
      </Tabs.Root>
    </EnvironmentProvider>
  );
}
