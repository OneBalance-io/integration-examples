"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTurnkeyLogin } from "../turnkey/use-turnkey-login";

export const ClientLogin = ({
  onClick,
  isUserLoading,
  isPending,
}: {
  onClick: () => void;
  isUserLoading: boolean;
  isPending: boolean;
}) => {
  const { login, isLoginPending } = useTurnkeyLogin();

  return (
    <>
      <TooltipProvider delayDuration={200}>
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
        onClick={onClick}
        className="bg-transparent border-2 border-surface-level-4 text-white disabled:text-surface-level-4 py-4 px-10 rounded-full"
        disabled={isPending}
      >
        {isPending ? "Signing up..." : "Signup"}
      </button>
    </>
  );
};
