"use client";
import { useTurnkey } from "@turnkey/sdk-react";
import { useTurnkeyAuth } from "../turnkey/use-turnkey-auth";
import { createSubOrganization } from "@/app/actions";
import humanId from "human-id";

export const Login = () => {
  const { login } = useTurnkeyAuth();
  const { passkeyClient } = useTurnkey();

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
    <div className="flex justify-center">
      <div className="rounded-lg text-center border-surface-level-3 border py-8 px-5 bg-surface-level-2 inline-block">
        <h1 className="font-semibold text-3xl max-w-96 mx-auto">
          Welcome to OneBalance + Turnkey example app
        </h1>

        <hr className="max-w-32 mx-auto my-5 border-surface-level-3" />

        <button
          onClick={() => login()}
          className="bg-brand-orange rounded-full text-black py-4 px-10 font-medium"
        >
          Please log in
        </button>

        <button
          onClick={() => createSubOrg()}
          className="rounded-full py-4 px-10 font-medium"
        >
          Signup
        </button>
      </div>
    </div>
  );
};
