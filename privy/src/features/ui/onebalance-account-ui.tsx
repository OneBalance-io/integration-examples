import { useOneBalanceAccountAddress } from "../onebalance-account/use-onebalance-account";

export const OneBalanceAccountUI = ({
  query,
}: {
  query: ReturnType<typeof useOneBalanceAccountAddress>;
}) => {
  const { status, data: account, error } = query;

  return (
    <>
      {status === "pending" ? (
        <p className="animate-pulse flex flex-col gap-1">
          <span>Creating your OneBalance account</span>
          <span className="text-sm">Please wait...</span>
        </p>
      ) : null}

      {status === "success" ? (
        <p className="flex flex-col gap-1">
          <span>Your OneBalance account is ready</span>
          <code className="text-brand-orange text-sm">
            {account.predictedAddress}
          </code>
        </p>
      ) : null}

      {status === "error" ? (
        <>
          <p className="text-red-500">Failed to create OneBalance account</p>
          <code>
            {error.name} {error.message}
          </code>
        </>
      ) : null}
    </>
  );
};
