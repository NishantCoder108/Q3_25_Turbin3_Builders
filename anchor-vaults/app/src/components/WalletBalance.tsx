"use client";
import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "sonner";
import { Connection } from "@solana/web3.js";
import { AnimatedNumberBasic } from "./AnimatedNumber";

const rpcURL =
  (process.env.NEXT_PUBLIC_RPC_URL as string) ||
  "https://api.devnet.solana.com";

export const SOLBalance = () => {
  const [balance, setBalance] = useState<number>(0);
  const wallet = useWallet();
  const isWalletConnected = wallet.connected;

  const pubKey = wallet.publicKey;

  const getUserBal = async function getBalance() {
    if (!pubKey) {
      toast.error("Please connect your wallet .");
      return;
    }
    try {
      const connection = new Connection(rpcURL || "");

      const balanceLamports = await connection.getBalance(pubKey, "confirmed");
      const balanceSOL = balanceLamports / 1e9;

      setBalance(balanceSOL);
    } catch (error) {
      setBalance(0);
      console.error("Error fetching balance:", error);
    }
  };

  useEffect(() => {
    getUserBal();
  }, [isWalletConnected]);
  return (
    <div>
      {balance && (
        <p className="font-semibold text-white text-base flex items-center justify-center ">
          <AnimatedNumberBasic number={Number(balance)} className="px-1 pl-3" />
          <span className="text-base hidden sm:block"> SOL </span>
        </p>
      )}
    </div>
  );
};
