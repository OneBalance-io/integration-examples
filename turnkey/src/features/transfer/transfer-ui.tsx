"use client";
import { formatUnits } from "viem";
import { useBalances } from "../balances/use-balances";
import { useState } from "react";
import { AssetId } from "../assets/assets";
import { useTransfer } from "./use-transfer";
import { useSupportedChains } from "../chain/use-supported-chains";
import { TransactionStatusUI } from "../transaction-status/transaction-status-ui";

export const Transfer = () => {
  const balancesQuery = useBalances();
  const chainsQuery = useSupportedChains();

  return (
    <div>
      <h2 className="text-2xl font-medium">Transfer</h2>

      {balancesQuery.status === "pending" ||
      chainsQuery.status === "pending" ? (
        <p className="animate-pulse text-white/50">Loading data...</p>
      ) : null}
      {balancesQuery.status === "success" &&
      chainsQuery.status === "success" ? (
        <TransferForm balances={balancesQuery.data} chains={chainsQuery.data} />
      ) : null}
    </div>
  );
};

const TransferForm = ({
  balances,
  chains,
}: {
  balances: NonNullable<ReturnType<typeof useBalances>["data"]>;
  chains: NonNullable<ReturnType<typeof useSupportedChains>["data"]>;
}) => {
  const { submit, mutation } = useTransfer();
  const [assetId, setAssetId] = useState<AssetId>(
    balances.assets[0].aggregatedAssetId
  );
  const [amount, setAmount] = useState<string>("");
  const asset = balances.assets.find(
    (asset) => asset.aggregatedAssetId === assetId
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
        <label htmlFor="asset" className="text-sm text-white/70">
          Asset
        </label>

        <select
          id="asset"
          name="asset"
          value={assetId}
          className="px-4 py-3 rounded-xl bg-surface-level-3 h-14"
          onChange={(event) => setAssetId(event.target.value as AssetId)}
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

        {asset ? (
          <p className="text-white/60 text-sm">
            {formatUnits(amountAsBigInt, asset.decimals)} {asset.symbol}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="address" className="text-sm text-white/70">
          Recipient address
        </label>

        <input
          type="text"
          id="address"
          name="address"
          required
          className="px-4 py-3 rounded-xl bg-surface-level-3 h-14"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="chain" className="text-sm text-white/70">
          Destination chain
        </label>

        <select
          id="chain"
          name="chain"
          className="px-4 py-3 rounded-xl bg-surface-level-3 h-14"
        >
          {chains.map((chain) => {
            return (
              <option value={chain.chain.chain} key={chain.chain.chain}>
                {chain.chain.reference}
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
            <span className="animate-pulse">Transferring...</span>
          ) : (
            "Initiate transfer"
          )}
        </button>
        <p className="text-red-400">{mutation.error?.message}</p>
      </div>
    </form>
  );
};
