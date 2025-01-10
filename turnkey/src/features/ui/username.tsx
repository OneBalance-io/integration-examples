"use client";
import { useTurnkeyAuth } from "../turnkey/use-turnkey-auth";

export const Username = () => {
  const { user } = useTurnkeyAuth();

  return (
    <>
      <span className="font-medium text-xl underline underline-offset-4 decoration-brand-orange">
        Welcome
      </span>
      <span className="text-white/60">
        {user ? `, ${user.username}` : null}
      </span>
    </>
  );
};
