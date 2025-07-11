"use client";

import { useWallet } from "@solana/wallet-adapter-react";
// import { createSolanaClient, LAMPORTS_PER_SOL } from "gill";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import DepositDialog from "./depositDiaglog";
import WithdrawDialog from "./withdrawDiaglog";
import CloseDialog from "./closeDialog";
import {
  getVaultProgram,
  getVaultPDA,
  getVaultStatePDA,
} from "@/utils/anchor_vaults";
import { useAnchorProvider } from "@/hooks/useAnchorProvider";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useRouter } from "next/navigation";

export default function VaultUi() {
  const wallet = useWallet();
  const [userBalance, setUserBalance] = useState("");
  const [vaultBalance, setVaultBalance] = useState("");
  const [loading, setLoading] = useState(false);
  const [vaultLoading, setVaultLoading] = useState(false);
  const router = useRouter();
  const provider = useAnchorProvider();

  const program = getVaultProgram(provider);

  const getVaultSolBalance = async () => {
    if (!wallet.publicKey) return;

    try {
      setVaultLoading(true);

      const vaultState = getVaultStatePDA(wallet.publicKey, program.programId);
      const vault = getVaultPDA(vaultState, program.programId);

      const vaultAccountInfo = await provider.connection.getAccountInfo(vault);

      if (vaultAccountInfo === null) {
        toast.error("No vault account found");
        router.push("/");
      }

      // get total SOL in the vault account
      const rawBalance = await provider.connection.getBalance(vault);

      // get rent-exempt minimum for a system account (no data)
      const rentExempt =
        await provider.connection.getMinimumBalanceForRentExemption(10);

      // Usable balance (if negative, clamp to 0)
      const usableBalanceLamports = Math.max(rawBalance - rentExempt, 0);

      const balanceInSOL = usableBalanceLamports / LAMPORTS_PER_SOL;
      setVaultBalance(balanceInSOL.toFixed(4));
    } catch (e) {
      console.error("Failed to fetch vault balance:", e);
      toast.error("Could not fetch vault balance");
    } finally {
      setVaultLoading(false);
    }
  };

  const getUserWalletBalance = async () => {
    setLoading(true);
    const pk = wallet.publicKey;
    const balance = await provider.connection.getBalance(pk as PublicKey);
    const balanceInSOL = balance / LAMPORTS_PER_SOL;
    setUserBalance(balanceInSOL.toFixed(4));
    setLoading(false);
  };

  useEffect(() => {
    if (wallet.publicKey) {
      getUserWalletBalance();
      getVaultSolBalance();
    }
  }, [wallet.publicKey]);
  return (
    <div className="md:w-1/2 w-4/5 h-3/5 flex flex-col items-center justify-start p-5 py-10 space-y-2 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-3xl border-green-400 border-2">
      <h2 className="array-font text-6xl">dVault</h2>

      {/* wallet balance */}
      {wallet.publicKey && !loading ? (
        <p className="font-medium text-sm text-neutral-500 flex items-center">
          Wallet Balance :
          <span className="font-bold px-1 text-black">{userBalance}</span>
          SOL
        </p>
      ) : (
        <Loader2 className="w-4 h-4 animate-spin" />
      )}

      {/* vault details */}
      <div className="w-full flex items-center justify-center py-8">
        {wallet.publicKey && !vaultLoading ? (
          <p className="flex items-center space-x-1">
            <span className=" text-neutral-500 font-medium md:text-base text-sm">
              Avail :
            </span>
            <span className="font-bold md:text-6xl text-4xl">
              {vaultBalance ?? "0.0000"}
            </span>
            <span className=" text-neutral-500 font-medium md:text-base text-sm">
              SOL
            </span>
          </p>
        ) : (
          <Loader2 className="w-4 h-4 animate-spin" />
        )}
      </div>
      <ActionButtons />
    </div>
  );
}

const ActionButtons = () => {
  return (
    <div className="w-full flex md:flex-row flex-col items-center md:justify-center md:space-x-5 md:space-y-0 space-y-2">
      <DepositDialog />
      <WithdrawDialog />
      <CloseDialog />
    </div>
  );
};
