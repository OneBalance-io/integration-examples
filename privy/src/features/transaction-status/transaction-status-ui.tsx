import { useTransactionStatus } from "./use-transaction-status";

export const TransactionStatusUI = ({
  quoteId,
  onReset,
}: {
  quoteId: string;
  onReset: () => void;
}) => {
  const transactionStatusQuery = useTransactionStatus({
    quoteId,
  });

  if (transactionStatusQuery.status === "pending") {
    return <p className="animate-pulse">Fetching transaction status...</p>;
  }

  if (transactionStatusQuery.status === "error") {
    return <p>Error fetching transaction status</p>;
  }

  if (transactionStatusQuery.data._tag === "Empty") {
    return <p>No transaction status found yet. Waiting...</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-medium">Transaction Status</h2>
      <dl>
        <div className="flex gap-1">
          <dt className="text-white/70">Status:</dt>
          <dd>{transactionStatusQuery.data.status}</dd>
        </div>
        <div className="py-2">
          <dt className="border-t border-white/30 text-white/70">
            Origin Chain Operations:
          </dt>
          <dd>
            <ul>
              {transactionStatusQuery.data.originChainOperations.map(
                (operation) => (
                  <li key={operation.hash}>
                    <a href={operation.explorerUrl} target="_blank">
                      <code>{operation.hash}</code>
                    </a>
                  </li>
                )
              )}
            </ul>
          </dd>
        </div>
        <div className="py-2">
          <dt className="border-t border-white/30 text-white/70">
            Destination Chain Operations:
          </dt>
          <dd>
            <ul>
              {transactionStatusQuery.data.destinationChainOperations.map(
                (operation) => (
                  <li key={operation.hash}>
                    <a href={operation.explorerUrl} target="_blank">
                      <code>{operation.hash}</code>
                    </a>
                  </li>
                )
              )}
            </ul>
          </dd>
        </div>
      </dl>

      <div className="flex gap-4 mt-4">
        <button
          onClick={() => transactionStatusQuery.refetch()}
          className="bg-surface-level-3 rounded-full text-white py-3 px-10 font-medium"
        >
          Refresh transaction status
        </button>
        <button
          onClick={onReset}
          className="bg-surface-level-3 rounded-full text-white py-3 px-10 font-medium"
        >
          Back to swap
        </button>
      </div>
    </div>
  );
};
