import type { Metadata } from "next";
import "./globals.css";
import { SolanaProvider } from "@/providers/SolanaProvider";
import { Toaster } from "sonner";
// import Appbar from "@/components/WalletConnect";
import Navbar from "@/components/Navbar";
import { Inter } from "next/font/google";
import { BalanceProvider } from "@/context/BalContext";
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", // optional: for CSS variable usage
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
      <body className={` ${inter.variable} antialiased`}>
        <div
          className={`bg-[url("/images/bg.png")] bg-cover bg-center bg-no-repeat bg-fixed h-screen`}
        >
          <SolanaProvider>
            <BalanceProvider>
              <Toaster position="bottom-right" />
              <Navbar />
              {children}
            </BalanceProvider>
          </SolanaProvider>
        </div>
      </body>
    </html>
  );
}
