import { TabsTrigger } from "@radix-ui/react-tabs";
import { ComponentProps } from "react";

export const TabTrigger = (props: ComponentProps<typeof TabsTrigger>) => {
  return (
    <TabsTrigger
      {...props}
      className={`flex flex-row rounded-xl w-[108px] items-center justify-center py-2.5 px-3.5 text-sm font-normal aria-selected:bg-white aria-selected:text-black text-gray`}
    />
  );
};
