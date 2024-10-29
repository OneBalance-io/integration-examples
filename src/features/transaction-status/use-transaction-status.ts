import { skipToken, useQuery } from "@tanstack/react-query";
import { fetchTransactionStatus } from "./fetch-transaction-status";

export const useTransactionStatus = ({
  quoteId,
}: {
  quoteId: string | undefined;
}) => {
  return useQuery({
    queryKey: ["transaction-status", quoteId],
    queryFn: quoteId ? () => fetchTransactionStatus({ quoteId }) : skipToken,
    refetchInterval: 5_000,
  });
};
