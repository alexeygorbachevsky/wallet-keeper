import { ReactNode } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import ClientProviders from "./components/client-providers";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wallet Keeper - Secure Wallet Storage",
  description: "Create and manage your cryptocurrency wallets securely",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => (
  <html lang="en">
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
    </head>
    <body className={`${geistSans.variable} ${geistMono.variable}`}>
      <ClientProviders>{children}</ClientProviders>
      <div id="modal-root"></div>
    </body>
  </html>
);

export default RootLayout;
