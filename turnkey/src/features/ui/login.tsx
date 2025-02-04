"use client";
import { useTurnkey } from "@turnkey/sdk-react";
import { useTurnkeyAuth } from "../turnkey/use-turnkey-auth";
import { createSubOrganization } from "@/app/actions";
import humanId from "human-id";
import Image from "next/image";
import { useEffect, useState } from "react";

export const Login = () => {
  const { login, isLoginPending, isUserLoading } = useTurnkeyAuth();
  const { passkeyClient } = useTurnkey();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

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
          name: userName,
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

    const createSubOrganizationResponse = await createSubOrganization(
      undefined,
      challenge,
      attestation,
      userName
    );
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
            src="/onebalance.png"
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

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => login()}
            className="h-20 py-[30px] px-10 text-base bg-brand-orange rounded-full text-black"
          >
            {isLoginPending || isUserLoading
              ? "Logging in..."
              : "Log in with Passkey"}
          </button>

          <button
            onClick={() => createSubOrg()}
            className="bg-transparent border-2 border-surface-level-4 text-white disabled:text-surface-level-4 py-4 px-10 rounded-full"
          >
            Signup
          </button>
        </div>
      </div>
      <div className="flex-1" />
    </div>
  );
};
