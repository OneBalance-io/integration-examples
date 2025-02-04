import { ReactQueryProvider } from "@/features/react-query";
import { TurnkeyProvider } from "@turnkey/sdk-react";
import type { Metadata } from "next";
import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "OneBalance Bitcoin Demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
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
