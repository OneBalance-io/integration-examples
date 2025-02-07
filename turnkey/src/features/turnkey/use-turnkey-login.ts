"use client";
import { toast } from "sonner";
import { usePersistedBTCWallet } from "../onebalance-account/use-persisted-btc-wallet";
import { useMutation } from "@tanstack/react-query";
import { useTurnkey } from "@turnkey/sdk-react";
import { queryClient } from "../react-query";
import { useContext, useState } from "react";
import { WarningDialogContext } from "../warning-dialog";

export const useTurnkeyLogin = () => {
  const { passkeyClient } = useTurnkey();
  const { setIsWarningModalOpen } = useContext(WarningDialogContext);
  const {
    evm: [previousEvmOrgId, setEvmOrgId],
    btc: [, setBtcOrgId],
  } = usePersistedBTCWallet();

  const { mutate: login, isPending: isLoginPending } = useMutation({
    mutationFn: async () => {
      const loginResult = await passkeyClient!.login().then((result) => {
        queryClient.invalidateQueries({ queryKey: "authenticated" });
        queryClient.refetchQueries();
        return result;
      });
      return loginResult;
    },
    onSuccess: (loginResult) => {
      setEvmOrgId({ evmOrgId: loginResult.organizationId });
      if (
        previousEvmOrgId &&
        previousEvmOrgId.evmOrgId !== loginResult.organizationId
      ) {
        setBtcOrgId("null");
      }
      toast.dismiss();
      // setIsWarningModalOpen(true);
    },
  });

  return {
    login,
    isLoginPending,
  };
};
