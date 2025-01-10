"use client";
import { PropsWithChildren, ReactNode } from "react";
import { useTurnkeyAuth } from "./turnkey/use-turnkey-auth";

export const Authenticated = ({
  children,
  unauthenticated,
}: PropsWithChildren<{ unauthenticated: ReactNode }>) => {
  const { authenticated } = useTurnkeyAuth();

  if (!authenticated) return unauthenticated;
  return children;
};
