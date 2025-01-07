import { useState } from "react";
import { formatUnits } from "viem";
import { AssetId } from "../assets/assets";
import { useBalances } from "../balances/use-balances";
import { useSwap } from "./use-swap";
import { TransactionStatusUI } from "../transaction-status/transaction-status-ui";

export const Swap = () => {
  const balancesQuery = useBalances();

  return (
    <div>
      <h2 className="text-2xl font-medium">Swap</h2>

      {balancesQuery.status === "pending" ? (
        <p className="animate-pulse text-white/50">Loading data...</p>
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
    balances.assets[0].aggregatedAssetId
  );
  const [amount, setAmount] = useState<string>("");
  const fromAsset = balances.assets.find(
    (asset) => asset.aggregatedAssetId === fromAssetId
  );
  let amountAsBigInt: bigint;
  try {
    amountAsBigInt = BigInt(amount);
  } catch {
    amountAsBigInt = BigInt(0);
  }

  if (mutation.status === "success") {
    return (
      <TransactionStatusUI
        quoteId={mutation.data.quoteId}
        onReset={mutation.reset}
      />
    );
  }

  return (
    <form className="flex flex-col gap-4 mt-4 max-w-[500px]" onSubmit={submit}>
      <div className="flex flex-col gap-1">
        <label htmlFor="from" className="text-sm text-white/70">
          From
        </label>

        <select
          id="from"
          name="from"
          value={fromAssetId}
          className="px-4 py-3 rounded-xl bg-surface-level-3 h-14"
          onChange={(event) => setFromAssetId(event.target.value as AssetId)}
        >
          {balances.assets.map((asset) => {
            return (
              <option
                value={asset.aggregatedAssetId}
                key={asset.aggregatedAssetId}
              >
                {asset.symbol}
              </option>
            );
          })}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="amount" className="text-sm text-white/70">
          Amount
        </label>

        <input
          type="text"
          id="amount"
          name="amount"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          required
          className="px-4 py-3 rounded-xl bg-surface-level-3 h-14"
        />

        {fromAsset ? (
          <p className="text-white/60 text-sm">
            {formatUnits(amountAsBigInt, fromAsset.decimals)} {fromAsset.symbol}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="to" className="text-sm text-white/70">
          To
        </label>

        <select
          id="to"
          name="to"
          defaultValue={balances.assets[1].aggregatedAssetId}
          className="px-4 py-3 rounded-xl bg-surface-level-3 h-14"
        >
          {balances.assets.map((asset) => {
            return (
              <option
                value={asset.aggregatedAssetId}
                key={asset.aggregatedAssetId}
              >
                {asset.symbol}
              </option>
            );
          })}
        </select>
      </div>

      <div>
        <button
          type="submit"
          className="bg-brand-orange rounded-full text-black py-4 px-10 font-medium"
        >
          {mutation.status === "pending" ? (
            <span className="animate-pulse">Swapping...</span>
          ) : (
            "Initiate swap"
          )}
        </button>
        <p className="text-red-400">{mutation.error?.message}</p>
      </div>
    </form>
  );
};
