import { TabsTrigger } from "@radix-ui/react-tabs";
import { ComponentProps } from "react";

export const TabTrigger = (props: ComponentProps<typeof TabsTrigger>) => {
  return (
    <TabsTrigger
      {...props}
      className={`group first:rounded-tl-lg last:rounded-tr-lg border-b border-gray-300 aria-selected:border-b-brand-orange focus-visible:aria-selected:border-b-transparent bg-gray-50 flex-1 px-3 py-2.5 focus:aria-selected:border-b-red focus:z-10 focus:outline-none focus-visible:ring focus-visible:ring-brand-orange focus-visible:ring-opacity-75 font-medium ${
        props.className ?? ""
      }`}
    />
  );
};
