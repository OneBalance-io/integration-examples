import { Authenticated } from "@/features/authenticated";
import { Balances } from "@/features/balances/balances-ui";
import { EnvironmentProvider } from "@/features/environment/environment";
import { Pangram } from "@/features/font";
import { OneBalanceAccountRequired } from "@/features/onebalance-account/onebalance-account-required";
import { Swap } from "@/features/swap/swap-ui";
import { TransactionHistory } from "@/features/transaction-history/transaction-history-ui";
import { Transfer } from "@/features/transfer/transfer-ui";
import { Header } from "@/features/ui/header";
import { Login } from "@/features/ui/login";
import * as Tabs from "@radix-ui/react-tabs";
import { Toaster } from "sonner";

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
        <Header className={Pangram.className} />
        <main
          className={`max-w-screen-xl ${Pangram.className} flex-1 flex w-full`}
        >
          <Authenticated unauthenticated={<Login />}>
            <div className="mt-16 w-full text-center">
              <OneBalanceAccountRequired>
                <div>
                  <div className="mt-4">
                    <Tabs.Content value="balances">
                      <Balances
                        rootOrgId={process.env.PUBLIC_TURNKEY_ORGANIZATION_ID!}
                      />
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
      <Toaster />
    </EnvironmentProvider>
  );
}
