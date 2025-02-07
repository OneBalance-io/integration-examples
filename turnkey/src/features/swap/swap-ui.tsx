"use client";
import { useEffect, useMemo, useState } from "react";
import { formatUnits } from "viem";
import { AssetId } from "../assets/assets";
import { useBalances } from "../balances/use-balances";
import { TokenInput } from "../input/input";
import { useBTCAccount } from "../onebalance-account/use-btc-account";
import { TransactionStatusUI } from "../transaction-status/transaction-status-ui";
import { useSwap, useSwapQuote } from "./use-swap";

export const Swap = () => {
  const balancesQuery = useBalances();

  return (
    <div>
      <h1 className="text-5xl flex flex-col">
        <span>Just swap it,</span>
        <span className="text-gray">forget the chains</span>
      </h1>

      {balancesQuery.status === "pending" ? (
        <p className="animate-pulse text-white/50">Loading your account...</p>
      ) : null}
      {balancesQuery.status === "success" ? (
        <SwapForm balances={balancesQuery.data} />
      ) : null}
    </div>
  );
};

const SwapForm = ({
  balances,
}: {
  balances: NonNullable<ReturnType<typeof useBalances>["data"]>;
}) => {
  const { submit, mutation } = useSwap();
  const [fromAssetId, setFromAssetId] = useState<AssetId>(
    balances.btcBalance
      ? ("BTC" as AssetId)
      : balances.assets[1].aggregatedAssetId
  );
  const [toAssetId, setToAssetId] = useState<AssetId>(
    balances.assets[1].aggregatedAssetId
  );
  const [btcAccount] = useBTCAccount();
  const [amount, setAmount] = useState<string>("");
  const fromAsset =
    // @ts-expect-error
    fromAssetId === "BTC"
      ? { aggregatedAssetId: "BTC" as any, symbol: "BTC" }
      : balances.assets.find(
          (asset) => asset.aggregatedAssetId === fromAssetId
        );
  const fromAssetBalance =
    // @ts-expect-error
    fromAssetId === "BTC"
      ? {
          aggregatedAssetId: "BTC" as any,
          balance: balances.btcBalance?.balance ?? 0,
          decimals: 8,
        }
      : balances.balances.balanceByAsset.find(
          (balance) => balance.aggregatedAssetId === fromAssetId
        )!;
  const toAsset = balances.assets.find(
    (asset) => asset.aggregatedAssetId === toAssetId
  );
  const toAssetBalance = balances.balances.balanceByAsset.find(
    (balance) => balance.aggregatedAssetId === toAssetId
  )!;

  useEffect(() => {
    // reset amount when fromAssetId changes
    setAmount("");
  }, [fromAssetId]);

  const amountAsBigInt = useMemo(() => {
    if (!amount) return BigInt(0);

    try {
      return BigInt(
        Math.floor(
          parseFloat(amount) *
            // @ts-expect-error
            10 ** (fromAssetId === "BTC" ? 8 : fromAssetBalance.decimals)
        )
      );
    } catch {
      return BigInt(0);
    }
  }, [amount, fromAssetId, fromAssetBalance.decimals]);

  const swapQuoteQuery = useSwapQuote({
    amount: amountAsBigInt,
    fromAggregatedAssetId: fromAssetId,
    toAggregatedAssetId: toAssetId,
  });

  useEffect(() => {
    if (fromAssetId === toAssetId) {
      // find the first asset that is not the fromAssetId
      const firstAsset = balances.assets.find(
        (asset) => asset.aggregatedAssetId !== fromAssetId
      );
      setToAssetId(firstAsset!.aggregatedAssetId);
    }
  }, [fromAssetId, toAssetId]);

  const fromAssets = useMemo(() => {
    if (btcAccount._tag === "ExistingWallet") {
      return [
        { aggregatedAssetId: "BTC" as any, symbol: "BTC" },
        ...balances.assets,
      ];
    }
    return balances.assets;
  }, [btcAccount, balances.assets]);

  const toAssets = useMemo(() => {
    return fromAssets.filter(
      (asset) =>
        asset.aggregatedAssetId !== fromAssetId &&
        asset.aggregatedAssetId !== "BTC"
    );
  }, [fromAssetId, fromAssets]);

  if (mutation.status === "success") {
    return (
      <TransactionStatusUI
        quoteId={mutation.data.quoteId}
        onReset={mutation.reset}
      />
    );
  }

  const toAmount = swapQuoteQuery.isFetching
    ? "-"
    : (swapQuoteQuery.data?._tag === "BTC"
        ? swapQuoteQuery.data?.details.currencyOut?.amountFormatted
        : formatUnits(
            BigInt(swapQuoteQuery.data?.destinationToken.amount ?? "0"),
            toAssetBalance.decimals
          )) ?? "-";

  return (
    <form
      className="flex flex-col gap-4 mt-14 max-w-2xl mx-auto"
      onSubmit={(event) =>
        submit(
          event,
          {
            from: fromAssetId,
            to: toAssetId,
            amount: amountAsBigInt,
          },
          swapQuoteQuery.data
        )
      }
    >
      <TokenInput
        balance={{
          amount: BigInt(fromAssetBalance.balance),
          decimals: fromAssetBalance.decimals,
        }}
        asset={fromAsset!}
        setAssetId={setFromAssetId}
        assets={fromAssets}
        onMax={
          fromAssetBalance.balance
            ? () => {
                if (!fromAssetBalance.balance) return;

                if (fromAssetId === ("BTC" as any)) {
                  const btcMinusFee =
                    BigInt(fromAssetBalance.balance) - BigInt(1000);
                  setAmount(
                    formatUnits(btcMinusFee, fromAssetBalance.decimals)
                  );
                } else {
                  setAmount(
                    formatUnits(
                      BigInt(fromAssetBalance.balance),
                      fromAssetBalance.decimals
                    )
                  );
                }
              }
            : undefined
        }
        selectProps={{
          id: "from",
          name: "from",
        }}
        errorMessage={swapQuoteQuery.error?.message}
        inputProps={{
          placeholder: "0.00",
          type: "text",
          id: "amount",
          name: "amount",
          required: true,
          value: amount,
          onChange: (event) =>
            setAmount((event.target as HTMLInputElement).value),
        }}
      />

      <div className="flex justify-center my-4">
        <div className="size-3 rounded-sm border-2 border-l-transparent border-t-transparent relative top-[-4px] border-white rotate-45" />
      </div>

      <TokenInput
        balance={{
          amount: BigInt(toAssetBalance.balance),
          decimals: toAssetBalance.decimals,
        }}
        asset={toAsset!}
        setAssetId={setToAssetId}
        assets={toAssets}
        amount={toAmount}
        inputProps={{
          value: toAmount,
        }}
        selectProps={{
          id: "to",
          name: "to",
        }}
      />

      <div>
        <button
          type="submit"
          className="h-20 rounded-[100px] py-[30px] px-10 text-base bg-brand-orange text-brand-orange-foreground hover:bg-brand-orange-lighten-20 mt-20 w-full disabled:opacity-50 disabled:cursor-not-allowed justify-center flex"
          disabled={swapQuoteQuery.isFetching}
        >
          <span className="flex items-center gap-2">
            {mutation.status === "pending" ? (
              <span className="animate-pulse">Swapping...</span>
            ) : swapQuoteQuery.isFetching ? (
              <span className="animate-pulse">Retrieving quote...</span>
            ) : (
              "Swap tokens"
            )}

            {/* <span>
              <SwapRateRefresh
                startTime={new Date(swapQuoteQuery.dataUpdatedAt)}
              />
            </span> */}
          </span>
        </button>
        <p className="text-red-400">{mutation.error?.message}</p>
      </div>
    </form>
  );
};
