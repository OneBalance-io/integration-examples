"use client";
import Image from "next/image";
import { useTurnkeyAuth } from "../turnkey/use-turnkey-auth";
import { TabTrigger } from "../tabs/tab";
import * as Tabs from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

export const Header = ({ className }: { className?: string }) => {
  const { authenticated, logout } = useTurnkeyAuth();

  if (!authenticated) return null;

  return (
    <header
      className={cn(
        "p-4 max-w-screen-xl mx-auto flex w-full items-center gap-4",
        className
      )}
    >
      <div className="flex-1">
        <div className="max-w-40">
          <Image
            src="/onebalance.png"
            width={327}
            height={56}
            alt="OneBalance"
          />
        </div>
      </div>

      <div>
        <Tabs.List className="flex-1 flex bg-surface-level-2 p-2.5 rounded-[20px]">
          <TabTrigger value="balances">Balances</TabTrigger>
          <TabTrigger value="swap">Swap</TabTrigger>
          <TabTrigger value="transfer">Transfer</TabTrigger>
        </Tabs.List>
      </div>

      <div className="flex justify-end flex-1">
        <button
          className="bg-surface-level-2 text-white py-2.5 px-10 h-[60px] rounded-[100px]"
          onClick={logout}
        >
          Log Out
        </button>
      </div>
    </header>
  );
};
