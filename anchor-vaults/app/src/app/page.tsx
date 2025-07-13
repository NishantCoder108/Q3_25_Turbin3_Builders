"use client";
import TrustedBy from "@/components/TrustedBy";
import { Button } from "@/components/ui/button";
import { useAnchorProvider } from "@/hooks/useAnchorProvider";
import {
  getVaultPDA,
  getVaultProgram,
  getVaultStatePDA,
  initializeVault,
} from "@/utils/anchor_vaults";
import { useWallet } from "@solana/wallet-adapter-react";
import { Vault } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { TextShimmerWave } from "@/components/motion-primitives/text-shimmer-wave";
import { VaultError } from "@/lib/error";
import InteractingSol from "@/components/InteractingSol";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { AnimatedNumberBasic } from "@/components/AnimatedNumber";

export default function Home() {
  const wallet = useWallet();
  const provider = useAnchorProvider();
  // const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [vaultPubKey, setVaultPubKey] = useState("");
  const [vaultBalance, setVaultBalance] = useState("0");

  const handleCreateVault = async () => {
    if (!wallet.publicKey) {
      toast.error("Please connect your wallet to create vault");
      return;
    }
    try {
      setIsLoading(true);

      const program = getVaultProgram(provider);

      const vaultPubkey = getVaultStatePDA(wallet.publicKey, program.programId);
      console.log("vaultPubkey : ", vaultPubkey.toString());
      setVaultPubKey(vaultPubkey.toString());
      console.log(Object.keys(program.account));

      if (!program.account.vaultState) {
        throw new Error("vaultState account not found in program.account");
      }

      const vaultAccount = await program.account.vaultState.fetch(vaultPubkey);
      console.log({ vaultAccount });

      if (!vaultAccount) {
        await initializeVault(program);

        setIsInitialized(true);
        toast.success("Secure vault created successfully.");
        console.log("Vault not initialized, run initializeVault()");
      } else {
        setIsInitialized(true);
        toast.error("🎉 All good! Vault already exists.");
        console.log("🎉 All good! Vault already exists.");
      }
    } catch (e) {
      setIsInitialized(false);
      if (e instanceof VaultError) {
        console.log("Handled VaultError:", e.message);
      } else {
        console.error("Unknown error:", e);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getVaultSolBalance = async () => {
    if (!wallet.publicKey) return;

    try {
      const program = getVaultProgram(provider);
      const vaultState = getVaultStatePDA(wallet.publicKey, program.programId);
      const vault = getVaultPDA(vaultState, program.programId);

      const vaultAccountInfo = await provider.connection.getAccountInfo(vault);

      if (vaultAccountInfo === null) {
        toast.error("No vault account found, please create your vault");
        return;
      }

      // get total SOL in the vault account
      const rawBalance = await provider.connection.getBalance(vault);

      console.log("rawBalance : ", rawBalance);
      // get rent-exempt minimum for a system account (no data)
      const rentExempt =
        await provider.connection.getMinimumBalanceForRentExemption(10);

      // Usable balance (if negative, clamp to 0)
      const usableBalanceLamports = Math.max(rawBalance - rentExempt, 0);

      console.log("usableBalanceLamports : ", usableBalanceLamports);
      const balanceInSOL = usableBalanceLamports / LAMPORTS_PER_SOL;
      setVaultBalance(balanceInSOL.toFixed(7));
    } catch (e) {
      console.error("Failed to fetch vault balance:", e);
      toast.error("Could not fetch vault balance");
    }
  };

  useEffect(() => {
    if (isInitialized) {
      getVaultSolBalance();
    }
  }, [wallet.publicKey, isInitialized]);
  return (
    <div className="text-white  max-w-[50rem] mx-auto pt-28   gap-7 flex flex-col items-center justify-center  text-center">
      <h1 className="md:text-6xl font-bold leading-tight">
        {" "}
        Your Secure & Private Solana Vault
      </h1>
      <p className="text-[#E9E9E9] max-w-[37rem] text-center text-base">
        {" "}
        Secure your Solana in a fully decentralized vault. Protect your balance
        with on-chain privacy, maintain full control over your assets, and
        access your funds anytime — with complete transparency and trustless
        security.
      </p>

      {isInitialized || (
        <Button
          onClick={handleCreateVault}
          disabled={isLoading}
          className="flex gap-1.5 mt-5 items-center  justify-center cursor-pointer bg-[#522AA5] hover:bg-[#532aa5b4] rounded-full"
        >
          {" "}
          {isLoading ? (
            <TextShimmerWave
              className="[--base-color:#fff] [--base-gradient-color:#e9e9e96e]"
              duration={1}
              spread={1}
              zDistance={1}
              scaleDistance={1.1}
              rotateYDistance={20}
            >
              Launching ...
            </TextShimmerWave>
          ) : (
            <>
              {" "}
              <Vault /> <span> Launch Your Vault </span>{" "}
            </>
          )}
        </Button>
      )}

      {isInitialized && (
        <div className="flex flex-col items-center justify-center  text-sm mt-10">
          <h1 className="font-extralight">{vaultPubKey}</h1>

          <div className="flex items-center justify-center font-bold text-5xl mt-4">
            {" "}
            Avail Bal : <AnimatedNumberBasic
              number={Number(vaultBalance)}
            />{" "}
            SOL{" "}
          </div>
        </div>
      )}

      {isInitialized && (
        <div>
          <InteractingSol getVaultSolBalance={getVaultSolBalance} />
        </div>
      )}
      <div>{/* <TrustedBy /> */}</div>
    </div>
  );
}
