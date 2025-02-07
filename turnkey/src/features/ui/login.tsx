"use client";
import { createSubOrganization } from "@/app/actions";
import { useTurnkey } from "@turnkey/sdk-react";
import humanId from "human-id";
import Image from "next/image";
import { startTransition, useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { useTurnkeyAuth } from "../turnkey/use-turnkey-auth";
import { ClientLogin } from "./client-login";
import { ClientOnly } from "./client-only";

export const Login = () => {
  const { isUserLoading, refreshAuthStatus } = useTurnkeyAuth();
  const { passkeyClient } = useTurnkey();
  const [isHydrated, setIsHydrated] = useState(false);
  const [createSubOrganizationResult, createSubOrganizationAction, isPending] =
    useActionState(createSubOrganization, null);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (createSubOrganizationResult) {
      refreshAuthStatus();

      toast.success("Account created successfully. You can now log in.", {
        dismissible: true,
        duration: Infinity,
      });
    }
  }, [createSubOrganizationResult]);

  const createNewPasskey = async () => {
    const userName = humanId({
      separator: "-",
      capitalize: false,
    });

    const credential = await passkeyClient?.createUserPasskey({
      publicKey: {
        rp: {
          name: "Wallet Passkey",
        },
        user: {
          name: `[MAIN] ${userName}`,
        },
      },
    });

    // we'll use this credential in the next step to create a new sub-organization
    return { credential: credential!, userName };
  };

  const createSubOrg = async () => {
    const {
      credential: { encodedChallenge: challenge, attestation },
      userName,
    } = await createNewPasskey();

    startTransition(() => {
      createSubOrganizationAction({
        email: undefined,
        credential: challenge,
        attestation,
        userName,
      });
    });
  };

  return (
    <div
      className={`flex-1 flex flex-col justify-between gap-4 p-4 ${
        !isHydrated ? "invisible" : ""
      }`}
    >
      <div className="flex justify-center mx-auto flex-1">
        <div className="w-40 pt-14">
          <Image
            src="/onebalance_btc.png"
            width={327}
            height={56}
            alt="OneBalance"
          />
        </div>
      </div>
      <div className="rounded-lg text-center gap-16 flex flex-1 flex-col">
        <h1 className="text-5xl max-w-xl mx-auto">
          Welcome to OneBalance Bitcoin demo app
        </h1>

        <ClientOnly>
          <div className="flex gap-4 justify-center flex-col sm:flex-row">
            <ClientLogin
              onClick={() => createSubOrg()}
              isPending={isPending}
              isUserLoading={isUserLoading}
            />
            {/* <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => login()}
                  className="h-20 py-[30px] px-10 text-base bg-brand-orange rounded-full text-black"
                >
                  {isLoginPending || isUserLoading
                    ? "Logging in..."
                    : "Log in with Passkey"}
                </button>
              </TooltipTrigger>

              <TooltipContent>
                <p className="flex flex-col">
                  <span>Log in with your previously created Passkey.</span>
                  <span className="text-xs">Prefixed with [MAIN]</span>
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <button
            onClick={() => createSubOrg()}
            className="bg-transparent border-2 border-surface-level-4 text-white disabled:text-surface-level-4 py-4 px-10 rounded-full"
            disabled={isPending}
          >
            {isPending ? "Signing up..." : "Signup"}
          </button> */}
          </div>
        </ClientOnly>

        <div className="text-center text-sm">
          <a
            target="_blank"
            href="https://www.onebalance.io/post/onebalance-toolkit-bitcoin"
            className="underline underline-offset-4"
          >
            Learn more about Bitcoin in the OneBalance Toolkit
          </a>
        </div>
        <div>
          <p className="mt-4 text-gray text-sm text-center flex-col items-center flex gap-2 justify-center">
            <span>This is a demo app - please use with care.</span>
            <span className="underline underline-offset-4">
              Transactions are capped at $500.
            </span>
          </p>
        </div>
      </div>
      <div className="flex-1" />
    </div>
  );
};
