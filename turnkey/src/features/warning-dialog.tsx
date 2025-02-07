"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createContext, PropsWithChildren, useContext, useState } from "react";

export const WarningDialogContext = createContext<{
  isWarningModalOpen: boolean;
  setIsWarningModalOpen: (open: boolean) => void;
}>(null!);

export const WarningDialogProvider = ({ children }: PropsWithChildren) => {
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);

  return (
    <WarningDialogContext.Provider
      value={{ isWarningModalOpen, setIsWarningModalOpen }}
    >
      {children}
    </WarningDialogContext.Provider>
  );
};

export const WarningDialog = () => {
  const { isWarningModalOpen, setIsWarningModalOpen } =
    useContext(WarningDialogContext);

  return (
    <Dialog open={isWarningModalOpen} onOpenChange={setIsWarningModalOpen}>
      <DialogTrigger />

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Warning</DialogTitle>

          <DialogDescription className="text-base flex flex-col gap-2 pt-4">
            <span>
              This is a demo app, please use with care and do not deposit more
              than $500.
            </span>
            <span>Transactions are capped at $500.</span>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose className="h-14 px-10 text-base bg-brand-orange rounded-full text-black">
            I understand
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
