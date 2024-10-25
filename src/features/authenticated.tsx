import { usePrivy } from "@privy-io/react-auth";
import { PropsWithChildren, ReactNode } from "react";

export const Authenticated = ({
  children,
  unauthenticated,
}: PropsWithChildren<{ unauthenticated: ReactNode }>) => {
  const { authenticated } = usePrivy();

  if (!authenticated) return unauthenticated;
  return children;
};
