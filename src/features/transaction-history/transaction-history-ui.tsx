import { formatUnits } from "viem";
import { useTransactionHistory } from "./use-transaction-history";

export const TransactionHistory = () => {
  const transactionHistoryQuery = useTransactionHistory();

  return (
    <table className="table-auto">
      <tbody>
        {transactionHistoryQuery.data?.map((transaction) => {
          return (
            <tr key={transaction.quoteId}>
              <td className="border-b border-slate-800 dark:border-slate-700 p-4 pl-8">
                {transaction.type}
              </td>
              <td className="border-b border-slate-800 dark:border-slate-700 p-4">
                <span className="flex gap-1">
                  <span>
                    {formatUnits(
                      BigInt(transaction.originToken.amount),
                      transaction.originAsset.decimals
                    )}{" "}
                    {transaction.originAsset.symbol}
                  </span>
                  <span>{"->"}</span>

                  <span>
                    {formatUnits(
                      BigInt(transaction.destinationToken.amount),
                      transaction.destinationAsset.decimals
                    )}{" "}
                    {transaction.destinationAsset.symbol}
                  </span>
                </span>
              </td>
              <td className="border-b border-slate-800 dark:border-slate-700 p-4">
                <span className="flex flex-col">
                  <span>
                    {transaction.originChainOperations.length} origin chain
                    operations
                  </span>
                  <span>
                    {transaction.destinationChainOperations.length} destination
                    chain operations
                  </span>
                </span>
              </td>
              <td className="border-b border-slate-800 dark:border-slate-700 p-4 pr-8">
                {transaction.timestamp}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
