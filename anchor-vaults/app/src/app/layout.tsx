import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SolanaProvider } from "@/providers/SolanaProvider";
import { Toaster } from "sonner";
import Appbar from "@/components/WalletConnect";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Anchor Vault App",
  description: "User can deposit their SOL to the vault and withdraw it back.",
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
        <SolanaProvider>
          <Appbar />
          <Toaster position="bottom-right" />
          {children}
        </SolanaProvider>
      </body>
    </html>
  );
}
