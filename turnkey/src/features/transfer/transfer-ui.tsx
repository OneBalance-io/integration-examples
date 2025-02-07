"use client";
import { formatUnits, parseUnits, isAddress } from "viem";
import { useBalances } from "../balances/use-balances";
import { forwardRef, useMemo, useState } from "react";
import { AssetId } from "../assets/assets";
import { useTransfer } from "./use-transfer";
import { useSupportedChains } from "../chain/use-supported-chains";
import { TransactionStatusUI } from "../transaction-status/transaction-status-ui";
import { TokenInput } from "../input/input";
import type {
  InputHTMLAttributes,
  LabelHTMLAttributes,
  PropsWithChildren,
} from "react";
import { useId } from "react";
import {
  arbitrum,
  avalanche,
  base,
  linea,
  mainnet,
  optimism,
  polygon,
} from "viem/chains";

const chainObjects = [
  base,
  arbitrum,
  optimism,
  polygon,
  linea,
  avalanche,
  mainnet,
];

export const Transfer = () => {
  const balancesQuery = useBalances();
  const chainsQuery = useSupportedChains();

  return (
    <div className="px-2 pb-10">
      <h2 className="text-5xl flex flex-col">
        <span>Simple transfer,</span>
        <span className="text-gray">as it should be</span>
      </h2>

      {balancesQuery.status === "pending" ||
      chainsQuery.status === "pending" ? (
        <p className="animate-pulse text-white/50 mt-14">
          Loading your account...
        </p>
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
  const fromAssetBalance = balances.balances.balanceByAsset.find(
    (balance) => balance.aggregatedAssetId === assetId
  )!;

  const amountAsBigInt = useMemo(() => {
    try {
      return parseUnits(amount, asset!.decimals);
    } catch {
      return BigInt(0);
    }
  }, [amount, asset]);
  const [address, setAddress] = useState("");
  const addressError =
    address && !isAddress(address)
      ? "Please enter a valid Ethereum address"
      : undefined;

  // Add balance and USD value validation
  const balanceError = useMemo(() => {
    if (!amount || !fromAssetBalance.balance) return undefined;

    if (amountAsBigInt > BigInt(fromAssetBalance.balance)) {
      return "Insufficient balance";
    }

    // Calculate USD value based on proportion of balance
    const totalFiatValue = fromAssetBalance.fiatValue ?? 0;
    const proportion =
      Number(amountAsBigInt) / Number(fromAssetBalance.balance);
    const amountFiatValue = totalFiatValue * proportion;

    if (amountFiatValue > 500) {
      return "Amount exceeds $500 limit";
    }

    return undefined;
  }, [
    amountAsBigInt,
    fromAssetBalance.balance,
    fromAssetBalance.fiatValue,
    amount,
  ]);

  if (mutation.status === "success") {
    return (
      <TransactionStatusUI
        quoteId={mutation.data.quoteId}
        onReset={mutation.reset}
      />
    );
  }

  return (
    <form
      className="flex flex-col gap-5 mt-14 max-w-2xl mx-auto"
      onSubmit={(event) => {
        event.preventDefault();

        // Return early if any validation fails
        if (
          mutation.status === "pending" ||
          balanceError ||
          !amountAsBigInt ||
          !!addressError ||
          !address ||
          amount === "0"
        ) {
          return;
        }

        // Proceed with submission if validation passes
        submit(event, amountAsBigInt);
      }}
    >
      <TokenInput
        balance={{
          amount: BigInt(fromAssetBalance.balance),
          decimals: fromAssetBalance.decimals,
        }}
        errorMessage={balanceError}
        asset={asset!}
        setAssetId={setAssetId}
        assets={balances.assets}
        selectProps={{
          id: "asset",
          name: "asset",
        }}
        inputProps={{
          type: "text",
          id: "amount",
          name: "amount",
          required: true,
          value: amount,
          onChange: (event) =>
            setAmount((event.target as HTMLInputElement).value),
        }}
      />

      <InputField
        inputProps={{
          type: "text",
          id: "address",
          name: "address",
          required: true,
          value: address,
          onChange: (e) => setAddress(e.target.value),
        }}
        labelProps={{
          children: (
            <span>
              Recipient address <RequiredSup />
            </span>
          ),
        }}
        error={addressError}
      />

      <select
        id="chain"
        name="chain"
        className="px-4 py-3 rounded-xl bg-surface-level-2 h-20 border border-surface-level-4"
      >
        {chains
          .flatMap((chain) => {
            const found = chainObjects.find(
              (chainObj) => Number(chain.chain.reference) === chainObj.id
            );
            if (!found) return [];

            return [[found.name, chain]] as const;
          })
          .map(([name, chain]) => {
            return (
              <option value={chain.chain.chain} key={chain.chain.chain}>
                {name}
              </option>
            );
          })}
      </select>

      <div className="mt-20">
        <p className="text-sm text-gray text-center mb-4">
          This is a demo app. Transactions are capped at $500
        </p>

        <button
          type="submit"
          className="h-20 rounded-[100px] py-[30px] px-10 text-base bg-brand-orange text-brand-orange-foreground hover:bg-brand-orange-lighten-20 w-full disabled:opacity-50 disabled:cursor-not-allowed justify-center flex"
          disabled={
            mutation.status === "pending" ||
            !!balanceError ||
            !amountAsBigInt ||
            !!addressError ||
            !address ||
            amount === "0"
          }
        >
          {mutation.status === "pending" ? (
            <span className="animate-pulse">Transferring...</span>
          ) : (
            "Transfer"
          )}
        </button>
        <p className="text-red-400">{mutation.error?.message}</p>
      </div>
    </form>
  );
};

export const InputField = ({
  labelProps,
  inputProps,
  error,
  className,
}: {
  inputProps: InputHTMLAttributes<HTMLInputElement>;
  labelProps?: LabelHTMLAttributes<HTMLLabelElement>;
  className?: string;
  error?: string;
}) => {
  const fallbackId = useId();
  const rootErrorId = useId();
  const errorId = error ? `${rootErrorId}-error` : undefined;
  const id = inputProps.id ?? fallbackId;

  return (
    <div className={className}>
      <div
        className={`flex flex-col h-20 bg-surface-level-2 ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 rounded-xl overflow-hidden text-base border relative ${
          error ? "border-destructive" : "border-surface-level-4"
        }`}
      >
        {labelProps ? (
          <label
            htmlFor={id}
            {...labelProps}
            className={`pl-6 text-sm text-left pt-[14px] text-gray ${
              className ?? ""
            }`}
          />
        ) : null}
        <Input
          id={id}
          aria-invalid={errorId ? true : undefined}
          aria-describedby={errorId}
          {...inputProps}
          className={`bg-transparent h-full pl-6 text-white ${
            inputProps.className ?? ""
          }`}
        />
      </div>
      {errorId ? (
        <div className="min-h-6 pt-2">
          <p id={errorId} className="text-destructive text-xs text-left">
            {error}
          </p>
        </div>
      ) : null}
    </div>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={`flex h-10 w-full bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
          className ?? ""
        }`}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

const RequiredSup = (props: PropsWithChildren<{ className?: string }>) => (
  <sup {...props} className={`text-brand-orange ${props.className ?? ""}`}>
    *
  </sup>
);
