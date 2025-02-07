import { forwardRef } from "react";
import { formatUnits } from "viem";
import { AssetId } from "../assets/assets";

export const TokenInput = ({
  balance,
  asset,
  setAssetId,
  assets,
  amount,
  selectProps,
  inputProps,
  errorMessage,
  onMax,
}: {
  balance: {
    amount: bigint;
    decimals: number;
  };
  asset: {
    aggregatedAssetId: AssetId;
    symbol: string;
  };
  setAssetId: (assetId: AssetId) => void;
  assets: {
    aggregatedAssetId: AssetId;
    symbol: string;
  }[];
  amount?: string;
  selectProps?: React.HTMLProps<HTMLSelectElement>;
  inputProps?: React.HTMLProps<HTMLInputElement>;
  errorMessage?: string;
  onMax?: () => void;
}) => {
  return (
    <div>
      <div
        className={`flex relative gap-1 lg:gap-3 h-10 lg:h-20 bg-surface-level-2 items-center rounded-xl py-4 px-6 border ${
          errorMessage ? "border-destructive" : "border-surface-level-4"
        }`}
      >
        <div className="relative w-full overflow-hidden flex flex-col gap-2">
          <Input
            placeholder="0.00"
            disabled={!!amount}
            autoComplete="off"
            {...inputProps}
          />

          <div className="text-gray text-left text-sm">
            Balance: {formatUnits(balance.amount, balance.decimals)}{" "}
            {asset.symbol}
          </div>
        </div>

        <div className="flex items-center">
          {onMax ? (
            <div className="px-4 py-5">
              <button
                type="button"
                className="lowercase bg-surface-level-4 py-2.5 px-5 rounded-full focusable text-sm"
                onClick={onMax}
              >
                Max
              </button>
            </div>
          ) : null}

          <div className="absolute lg:relative top-16 right-0 lg:right-auto lg:top-0 flex items-center gap-4">
            <select
              value={asset.aggregatedAssetId}
              onChange={(event) => setAssetId(event.target.value as AssetId)}
              className="px-4 rounded-full bg-surface-level-4 h-10 text-center"
              {...selectProps}
            >
              {assets.map((asset) => (
                <option
                  key={asset.aggregatedAssetId}
                  value={asset.aggregatedAssetId}
                >
                  {asset.symbol}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {errorMessage ? (
        <div className="mt-10 lg:mt-0 min-h-5 pt-2">
          <p className="text-xs text-destructive h-[1rem] first-letter:uppercase">
            {errorMessage && <>{errorMessage}</>}
          </p>
        </div>
      ) : null}
    </div>
  );
};

const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={`flex w-full bg-transparent text-xl file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
        className ?? ""
      }`}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";
