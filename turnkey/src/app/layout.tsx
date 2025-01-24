import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TurnkeyProvider } from "@turnkey/sdk-react";
import { ReactQueryProvider } from "@/features/react-query";

export const dynamic = "force-dynamic";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TurnkeyProvider
          config={{
            rpId: process.env.PUBLIC_TURNKEY_RP_ID,
            apiBaseUrl: "https://api.turnkey.com",
            iframeUrl: "https://auth.turnkey.com",
            defaultOrganizationId: process.env.PUBLIC_TURNKEY_ORGANIZATION_ID!,
          }}
        >
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </TurnkeyProvider>
      </body>
    </html>
  );
}
