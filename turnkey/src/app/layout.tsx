import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TurnkeyProvider } from "@turnkey/sdk-react";
import { ReactQueryProvider } from "@/features/react-query";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Turnkey integration example",
};

if (typeof window !== "undefined") {
  if (!process.env.NEXT_PUBLIC_TURNKEY_ORGANIZATION_ID)
    throw new Error("NEXT_PUBLIC_TURNKEY_ORGANIZATION_ID is required");
  if (!process.env.NEXT_PUBLIC_TURNKEY_RP_ID)
    throw new Error("NEXT_PUBLIC_TURNKEY_RP_ID is required");
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        data-rpid={process.env.NEXT_PUBLIC_TURNKEY_RP_ID}
        data-orgid={process.env.NEXT_PUBLIC_TURNKEY_ORGANIZATION_ID}
      >
        <TurnkeyProvider
          config={{
            rpId: process.env.NEXT_PUBLIC_TURNKEY_RP_ID,
            apiBaseUrl: "https://api.turnkey.com",
            iframeUrl: "https://auth.turnkey.com",
            defaultOrganizationId:
              process.env.NEXT_PUBLIC_TURNKEY_ORGANIZATION_ID!,
          }}
        >
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </TurnkeyProvider>
      </body>
    </html>
  );
}
