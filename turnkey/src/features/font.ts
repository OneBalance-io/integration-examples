import localFont from "next/font/local";

export const Pangram = localFont({
  src: [
    {
      path: "../features/fonts/Pangram-Black-900.woff",
      weight: "900",
      style: "normal",
    },
    {
      path: "../features/fonts/Pangram-ExtraBold-800.woff",
      weight: "800",
      style: "normal",
    },
    {
      path: "../features/fonts/Pangram-Bold-700.woff",
      weight: "700",
      style: "normal",
    },
    {
      path: "../features/fonts/Pangram-Medium-500.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "../features/fonts/Pangram-Regular-400.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../features/fonts/Pangram-Light-300.woff",
      weight: "300",
      style: "normal",
    },
    {
      path: "../features/fonts/Pangram-ExtraLight-200.woff",
      weight: "200",
      style: "normal",
    },
  ],
});
