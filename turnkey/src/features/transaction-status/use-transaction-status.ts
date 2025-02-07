import { skipToken, useQuery } from "@tanstack/react-query";
import { fetchTransactionStatus } from "./fetch-transaction-status";
import { useEnvironment } from "../environment/environment";

export const useTransactionStatus = ({
  quoteId,
}: {
  quoteId: string | undefined;
}) => {
  const { apiKey, apiUrl } = useEnvironment();

  return useQuery({
    queryKey: ["transaction-status", quoteId],
    queryFn: quoteId
      ? () => fetchTransactionStatus({ quoteId, apiKey, apiUrl })
      : skipToken,
    refetchInterval: 1_000,
  });
};
