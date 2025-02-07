"use client";
import { formatUnits } from "viem";
import { formatUSD } from "../currency/format-usd";
import { useBalances } from "./use-balances";
import * as Tabs from "@radix-ui/react-tabs";
import { ComponentProps, Fragment, ReactNode } from "react";
import { useOneBalanceAccountAddress } from "../onebalance-account/use-onebalance-account";
import { useBTCAccount } from "../onebalance-account/use-btc-account";
import { CreateBTCWalletUI } from "../onebalance-account/create-btc-wallet-ui";
import { useTurnkey } from "@turnkey/sdk-react";
import { useTurnkeyAuth } from "../turnkey/use-turnkey-auth";

export const Balances = ({ rootOrgId }: { rootOrgId: string }) => {
  const balancesQuery = useBalances();
  const { data: account } = useOneBalanceAccountAddress();
  const [btcWallet, btcAddress, createBTCWallet] = useBTCAccount();
  const { passkeyClient } = useTurnkey();
  const { user } = useTurnkeyAuth();

  return (
    <div>
      <h1 className="text-5xl">Welcome</h1>

      <Tabs.Root defaultValue="evm" className="max-w-2xl mx-auto mt-8">
        <Tabs.List className="flex flex-col sm:flex-row px-2">
          <TabTrigger
            value="evm"
            title="EVM Balance"
            address={account?.predictedAddress}
            fiatBalance={balancesQuery.data?.balances.totalBalance.fiatValue}
            isLoading={balancesQuery.status === "pending"}
            className="sm:rounded-l-xl rounded-t-xl sm:rounded-tr-none"
          />

          {btcWallet._tag === "NoWallet" ? (
            createBTCWallet.status === "pending" ? (
              <div className="flex text-left pl-4 items-center w-1/2">
                <p className="animate-pulse flex flex-col gap-1">
                  <span>Creating your BTC wallet</span>
                  <span className="text-sm">Please wait...</span>
                </p>
              </div>
            ) : (
              <CreateBTCWalletUI
                rootOrgId={rootOrgId}
                onSubmit={async () => {
                  if (!user) return;

                  const credential = await passkeyClient?.createUserPasskey({
                    publicKey: {
                      rp: {
                        name: "BTC Wallet Passkey",
                      },
                      user: {
                        name: `[BTC] ${user.username}`,
                      },
                    },
                  });
                  if (!credential) return;

                  const { encodedChallenge: challenge, attestation } =
                    credential;

                  createBTCWallet.mutate({
                    userName: user.username,
                    apiKeys: [],
                    authenticators: [
                      {
                        authenticatorName: "Default BTC Passkey",
                        challenge: challenge,
                        attestation: attestation,
                      },
                    ],
                    oauthProviders: [],
                  });
                }}
              />
            )
          ) : btcAddress ? (
            <TabTrigger
              value="btc"
              title="BTC Balance"
              address={btcAddress?.address}
              fiatBalance={balancesQuery.data?.btcBalance?.fiatValue}
              className="sm:rounded-r-xl rounded-b-xl sm:rounded-bl-none"
              isLoading={balancesQuery.status === "pending"}
              disabled
            />
          ) : (
            <TabTrigger
              value="btc"
              title="BTC Balance"
              address={undefined}
              fiatBalance={undefined}
              className="sm:rounded-r-xl rounded-b-xl sm:rounded-bl-none"
              isLoading={balancesQuery.status === "pending"}
              disabled
            />
          )}
        </Tabs.List>

        <p className="text-sm text-gray text-center mb-2 pt-2">
          This is a demo app, please use with care. Please do not deposit more
          than $500.
        </p>

        <div className="text-center text-sm">
          <a
            target="_blank"
            href="https://www.onebalance.io/post/onebalance-toolkit-bitcoin"
            className="underline underline-offset-4"
          >
            Learn more about Bitcoin in the OneBalance Toolkit
          </a>
        </div>

        <Tabs.Content value="evm">
          {balancesQuery.status === "success" &&
          balancesQuery.data.balances.balanceByAsset.filter(
            (balance) => balance.balance !== "0"
          ).length > 0 ? (
            <div className="mt-6">
              <div className="grid grid-cols-2 border-2 border-surface-level-2 rounded-xl p-5 text-xs text-gray">
                <div>
                  <h3 className="text-left">Token</h3>
                </div>
                <div>
                  <h3 className="text-right">Balance</h3>
                </div>
              </div>

              {balancesQuery.data.balances.balanceByAsset
                .filter((balance) => balance.balance !== "0")
                .map((balance) => (
                  <div
                    key={balance.aggregatedAssetId}
                    className="grid grid-cols-2"
                  >
                    <dt className="p-5">
                      <div className="flex flex-col text-left gap-1">
                        <span className="text-sm">{balance.name}</span>
                        <span className="text-xs text-gray">
                          {balance.symbol}
                        </span>
                      </div>
                    </dt>
                    <dd className="p-5">
                      <div className="flex flex-col text-right gap-1">
                        <span className="text-sm">
                          {formatUnits(
                            BigInt(balance.balance),
                            balance.decimals
                          )}{" "}
                          {balance.symbol}
                        </span>
                        {balance.fiatValue !== undefined ? (
                          <span className="text-xs text-gray">
                            {formatUSD(balance.fiatValue)}
                          </span>
                        ) : null}
                      </div>
                    </dd>
                  </div>
                ))}
            </div>
          ) : null}
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
};

const TabTrigger = (
  props: ComponentProps<typeof Tabs.Trigger> & {
    address: string | undefined;
    fiatBalance: number | undefined;
    title: ReactNode;
    isLoading: boolean;
  }
) => {
  const { title, fiatBalance, address, isLoading, ...rest } = props;

  return (
    <Tabs.Trigger
      {...rest}
      className={`flex aria-selected:bg-surface-level-2 p-5 text-left w-full sm:w-1/2 border border-surface-level-2 ${
        props.className ?? ""
      }`}
      asChild
    >
      {/* sigh.. a clickable div, i know, i know.. but needed for the copy button to work */}
      <div>
        <dl className="flex flex-col gap-4">
          <dt className="text-gray">{props.title}</dt>
          <dd className="text-4xl">
            {props.fiatBalance !== undefined ? (
              formatUSD(props.fiatBalance)
            ) : props.isLoading ? (
              <span className="animate-pulse text-xs">Loading...</span>
            ) : (
              "..."
            )}
          </dd>
          {props.address ? (
            <div className="flex gap-2 items-center">
              <p className="text-gray flex" title={props.address}>
                <span>{props.address.slice(0, 8)}</span>
                <span>...</span>
                <span>{props.address.slice(-8)}</span>
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (props.address) {
                    navigator.clipboard.writeText(props.address);
                  }
                }}
                className="text-gray hover:text-white hover:bg-surface-level-4 rounded-full p-1 text-sm self-start"
              >
                <div className="sr-only">Copy address</div>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 4V18H4"
                    stroke="#6F767E"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <rect
                    x="2"
                    y="2"
                    width="14"
                    height="14"
                    stroke="#6F767E"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          ) : null}
        </dl>
      </div>
    </Tabs.Trigger>
  );
};
