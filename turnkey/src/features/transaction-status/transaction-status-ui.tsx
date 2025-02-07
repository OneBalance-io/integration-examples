import { ExternalLink } from "lucide-react";
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
    return (
      <p className="animate-pulse mt-14 max-w-2xl mx-auto">
        Retrieving transaction status...
      </p>
    );
  }

  if (transactionStatusQuery.status === "error") {
    return (
      <p className="mt-14 max-w-2xl mx-auto">
        Error fetching transaction status
      </p>
    );
  }

  if (transactionStatusQuery.data._tag === "Empty") {
    return (
      <p className="mt-14 max-w-2xl mx-auto">
        No transaction status found yet. Waiting...
      </p>
    );
  }

  return (
    <div className="mt-14 max-w-2xl mx-auto">
      <h2 className="text-2xl font-medium text-left">Transaction Status</h2>
      <dl className="mt-4">
        <div className="flex gap-1">
          <div>
            {transactionStatusQuery.data.status === "COMPLETED" ? (
              <span className="flex items-center gap-2">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="20" cy="20" r="20" fill="#599A70" />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M20 30C25.5228 30 30 25.5228 30 20C30 14.4772 25.5228 10 20 10C14.4772 10 10 14.4772 10 20C10 25.5228 14.4772 30 20 30ZM25.7071 17.7071C26.0976 17.3166 26.0976 16.6834 25.7071 16.2929C25.3166 15.9024 24.6834 15.9024 24.2929 16.2929L19 21.5858L16.7071 19.2929C16.3166 18.9024 15.6834 18.9024 15.2929 19.2929C14.9024 19.6834 14.9024 20.3166 15.2929 20.7071L18.2929 23.7071C18.6834 24.0976 19.3166 24.0976 19.7071 23.7071L25.7071 17.7071Z"
                    fill="white"
                  />
                </svg>
                <span>Swap is successful</span>
              </span>
            ) : (
              <span>{transactionStatusQuery.data.status}</span>
            )}
          </div>
        </div>
        <div className="py-2 text-left flex flex-col gap-2 mt-4">
          <dt className=" text-white/70">
            Origin{" "}
            {transactionStatusQuery.data.originChainOperations.length > 1
              ? "transactions"
              : "transaction"}
          </dt>
          <dd>
            <ul>
              {transactionStatusQuery.data.originChainOperations.map(
                (operation) => (
                  <li key={operation.hash} className="flex items-center gap-2">
                    <a
                      href={operation.explorerUrl}
                      target="_blank"
                      className="underline underline-offset-4"
                    >
                      <code>{operation.hash}</code>
                    </a>
                    <ExternalLink />
                  </li>
                )
              )}
            </ul>
          </dd>
        </div>
        <div className="py-2 text-left flex flex-col gap-2">
          <dt className=" text-white/70">
            Destination{" "}
            {transactionStatusQuery.data.destinationChainOperations.length > 1
              ? "transactions"
              : "transaction"}
          </dt>
          <dd>
            <ul>
              {transactionStatusQuery.data.destinationChainOperations.map(
                (operation) => (
                  <li key={operation.hash} className="flex items-center gap-2">
                    <a
                      href={operation.explorerUrl}
                      target="_blank"
                      className="underline underline-offset-4"
                    >
                      <code>{operation.hash}</code>
                    </a>
                    <ExternalLink />
                  </li>
                )
              )}
            </ul>
          </dd>
        </div>
      </dl>

      <div className="flex gap-4 mt-4">
        <button
          onClick={onReset}
          className="bg-surface-level-3 rounded-full text-white py-3 px-10 font-medium"
        >
          Back to swap
        </button>

        <button
          onClick={() => transactionStatusQuery.refetch()}
          className="bg-surface-level-3 rounded-full text-white py-3 px-10 font-medium"
        >
          Refresh transaction status
        </button>
      </div>
    </div>
  );
};
