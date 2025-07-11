"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAnchorProvider } from "@/hooks/useAnchorProvider";
import {
  deposit,
  getVaultPDA,
  getVaultProgram,
  getVaultStatePDA,
} from "@/utils/anchor_vaults";
import { toast } from "sonner";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export default function InteractingSol() {
  const [activeTab, setActiveTab] = useState("deposit");
  const [solAmount, setSolAmount] = useState<number>(0);
  const [vaultBalance, setVaultBalance] = useState<string>("0");
  const wallet = useWallet();
  const provider = useAnchorProvider();
  //   const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleDeposit = async () => {
    try {
      setLoading(true);
      if (!wallet.publicKey) {
        toast.error("Please connect your wallet to create vault");
      }
      const program = getVaultProgram(provider);

      if (solAmount <= 0) {
        return toast.error("Amount need to be greater than 0");
      }

      const amountInSol = solAmount * LAMPORTS_PER_SOL;

      await deposit(amountInSol, program);

      toast.success("Yooo! You just made your deposit!");
      getVaultSolBalance();
    } catch (e) {
      console.error("error depositing fund to vault : ", e);
      console.warn("Error creating vault");
      toast.error("Error depositing fund to vault");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex space-x-1 bg-slate-800/50 p-1 rounded-full">
          <button
            disabled={loading ? true : false}
            onClick={() => setActiveTab("deposit")}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-full transition-colors max-w-fit ${
              activeTab === "deposit"
                ? "bg-purple-600 text-white"
                : "text-gray-300 hover:text-white hover:bg-slate-700"
            }`}
          >
            Deposit SOL
          </button>
          <button
            onClick={() => setActiveTab("withdraw")}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-full transition-colors max-w-fit ${
              activeTab === "withdraw"
                ? "bg-purple-600 text-white"
                : "text-gray-300 hover:text-white hover:bg-slate-700"
            }`}
          >
            Withdraw SOL
          </button>
          <button
            onClick={() => setActiveTab("close")}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-full transition-colors max-w-fit ${
              activeTab === "close"
                ? "bg-purple-600 text-white"
                : "text-gray-300 hover:text-white hover:bg-slate-700"
            }`}
          >
            Close Account
          </button>
        </div>

        {/* Input Section */}
        {activeTab === "deposit" && (
          <div className="flex space-x-2">
            <Input
              type="number"
              min={0}
              step="0.01"
              required
              placeholder="Enter amount in SOL"
              value={solAmount}
              onChange={(e) => setSolAmount(parseFloat(e.target.value))}
              className="flex-1 bg-gray-200 border-0 text-gray-800 placeholder:text-gray-500 rounded-lg"
            />
            <Button
              disabled={loading ? true : false}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 rounded-lg"
              onClick={handleDeposit}
            >
              Deposit
            </Button>
          </div>
        )}

        {activeTab === "withdraw" && (
          <div className="flex space-x-2">
            <Input
              type="number"
              placeholder="Enter SOL amount"
              value={String(solAmount)}
              onChange={(e) => setSolAmount(parseFloat(e.target.value))}
              className="flex-1 bg-gray-200 border-0 text-gray-800 placeholder:text-gray-500 rounded-lg"
            />
            <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6 rounded-lg">
              Withdraw
            </Button>
          </div>
        )}

        {activeTab === "close" && (
          <div className="text-center space-y-4">
            <p className="text-gray-300 text-sm">
              Are you sure you want to close your account?
            </p>
            <Button variant="destructive" className="w-full">
              Close Account
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
