import { usePrivy } from "@privy-io/react-auth";
import * as Tabs from "@radix-ui/react-tabs";
import { Authenticated } from "./features/authenticated";
import { Balances } from "./features/balances/balances-ui";
import { OneBalanceAccount } from "./features/onebalance-account/onebalance-account";
import { OneBalanceAccountRequired } from "./features/onebalance-account/onebalance-account-required";
import { Swap } from "./features/swap/swap-ui";
import { TabTrigger } from "./features/tabs/tab";
import { TransactionHistory } from "./features/transaction-history/transaction-history-ui";
import { useTransactionHistory } from "./features/transaction-history/use-transaction-history";
import { Transfer } from "./features/transfer/transfer-ui";
import { Header } from "./features/ui/header";
import { Login } from "./features/ui/login";

export function App() {
  const { authenticated, login, logout, ready, user } = usePrivy();
  const transactionHistoryQuery = useTransactionHistory();

  if (!ready) return null;

  return (
    <div>
      <Header logout={logout} authenticated={authenticated} />
      <main className="max-w-screen-xl mx-auto p-4">
        <Authenticated unauthenticated={<Login login={login} />}>
          <div>
            <h1>
              <span className="font-medium text-xl underline underline-offset-4 decoration-brand-orange">
                Welcome
              </span>
              <span className="text-white/60">
                {user && user.email ? `, ${user.email.address}` : null}
              </span>
            </h1>

            <div className="mt-4">
              <OneBalanceAccount />
            </div>

            <OneBalanceAccountRequired>
              <Tabs.Root defaultValue="balances" className="mt-8">
                <Tabs.List>
                  <TabTrigger value="balances">Balances</TabTrigger>
                  <TabTrigger value="swap">Swap</TabTrigger>
                  <TabTrigger value="transfer">Transfer</TabTrigger>
                  {transactionHistoryQuery.data?.length ? (
                    <TabTrigger value="history">Transaction History</TabTrigger>
                  ) : null}
                </Tabs.List>
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
              </Tabs.Root>
            </OneBalanceAccountRequired>
          </div>
        </Authenticated>
      </main>
    </div>
  );
}
