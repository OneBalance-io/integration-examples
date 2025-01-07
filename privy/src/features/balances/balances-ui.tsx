import { formatUnits } from "viem";
import { formatUSD } from "../currency/format-usd";
import { useBalances } from "./use-balances";

export const Balances = () => {
  const balancesQuery = useBalances();

  return (
    <div>
      <h2 className="text-2xl font-medium">Balance</h2>

      {balancesQuery.status === "pending" ? (
        <p className="animate-pulse text-white/50">Fetching balances...</p>
      ) : null}

      {balancesQuery.status === "success" ? (
        <div>
          <details>
            <summary>
              <dl className="flex gap-4 items-center leading-7">
                <dt className="text-xl font-medium">
                  <h3>Total Balance</h3>
                </dt>
                <dd>
                  {formatUSD(
                    balancesQuery.data.balances.totalBalance.fiatValue
                  )}
                </dd>
              </dl>
            </summary>

            <div>
              <dl>
                {balancesQuery.data.balances.balanceByAsset.map((balance) => (
                  <div
                    key={balance.aggregatedAssetId}
                    className="grid grid-cols-2 max-w-96"
                  >
                    <dt>{balance.name}</dt>
                    <dd>
                      {formatUnits(BigInt(balance.balance), balance.decimals)}{" "}
                      {balance.symbol}{" "}
                      {balance.fiatValue !== undefined ? (
                        <span className="text-white/60">
                          {formatUSD(balance.fiatValue)}
                        </span>
                      ) : null}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </details>
        </div>
      ) : null}
    </div>
  );
};
