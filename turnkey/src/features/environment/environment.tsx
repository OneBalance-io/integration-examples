"use client";
import { createContext, useContext, PropsWithChildren } from "react";

const EnvironmentContext = createContext<{
  apiUrl: string;
  apiKey: string;
}>(null!);

export const useEnvironment = () => useContext(EnvironmentContext);

export const EnvironmentProvider = ({
  apiKey,
  apiUrl,
  children,
}: PropsWithChildren<{
  apiKey: string;
  apiUrl: string;
}>) => {
  return (
    <EnvironmentContext.Provider
      value={{
        apiUrl,
        apiKey,
      }}
    >
      {children}
    </EnvironmentContext.Provider>
  );
};
