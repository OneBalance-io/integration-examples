import { useQuery } from "@tanstack/react-query";
import { fetchSupportedChains } from "./fetch-supported-chains";
import { useEnvironment } from "../environment/environment";

export const useSupportedChains = () => {
  const { apiKey, apiUrl } = useEnvironment();
  return useQuery({
    queryKey: ["supported-chains"],
    queryFn: () =>
      fetchSupportedChains({
        apiKey,
        apiUrl,
      }),
  });
};
