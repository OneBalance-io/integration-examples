import { useQuery } from "@tanstack/react-query";
import { fetchSupportedChains } from "./fetch-supported-chains";

export const useSupportedChains = () => {
  return useQuery({
    queryKey: ["supported-chains"],
    queryFn: fetchSupportedChains,
  });
};
