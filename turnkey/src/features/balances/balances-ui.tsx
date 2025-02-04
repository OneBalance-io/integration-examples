"use client";
import { formatUnits } from "viem";
import { formatUSD } from "../currency/format-usd";
import { useBalances } from "./use-balances";
import * as Tabs from "@radix-ui/react-tabs";
import { ComponentProps, Fragment, ReactNode } from "react";
import { useOneBalanceAccountAddress } from "../onebalance-account/use-onebalance-account";
import { useBTCAccount } from "../onebalance-account/use-btc-account";

export const Balances = () => {
  const balancesQuery = useBalances();
  const { data: account } = useOneBalanceAccountAddress();
  const [, btcAddress] = useBTCAccount();

  return (
    <div>
      <Tabs.Root defaultValue="evm" className="max-w-2xl mx-auto">
        <Tabs.List className="flex">
          <TabTrigger
            value="evm"
            title="EVM Balance"
            address={account?.predictedAddress}
            fiatBalance={balancesQuery.data?.balances.totalBalance.fiatValue}
            className="rounded-l-xl"
          />
          <TabTrigger
            value="btc"
            title="BTC Balance"
            address={btcAddress?.address}
            fiatBalance={balancesQuery.data?.btcBalance?.fiatValue}
            className="rounded-r-xl"
            disabled
          />
        </Tabs.List>

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
  }
) => {
  return (
    <Tabs.Trigger
      {...props}
      className={`flex aria-selected:bg-surface-level-2 p-5 text-left w-1/2 border border-surface-level-2 ${
        props.className ?? ""
      }`}
    >
      <dl className="flex flex-col gap-4">
        <dt className="text-gray">{props.title}</dt>
        <dd className="text-4xl">
          {props.fiatBalance ? formatUSD(props.fiatBalance) : "..."}
        </dd>
        {props.address ? (
          <div className="flex gap-2 items-center">
            <p className="text-gray flex">
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
    </Tabs.Trigger>
  );
};
