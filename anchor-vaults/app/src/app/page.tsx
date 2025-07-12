"use client";
import TrustedBy from "@/components/TrustedBy";
import { Button } from "@/components/ui/button";
import { useAnchorProvider } from "@/hooks/useAnchorProvider";
import {
  getVaultProgram,
  getVaultStatePDA,
  initializeVault,
} from "@/utils/anchor_vaults";
import { useWallet } from "@solana/wallet-adapter-react";
import { Vault } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { TextShimmerWave } from "@/components/motion-primitives/text-shimmer-wave";
import { VaultError } from "@/lib/error";
import { set } from "@coral-xyz/anchor/dist/cjs/utils/features";
import InteractingSol from "@/components/InteractingSol";

export default function Home() {
  const wallet = useWallet();
  const provider = useAnchorProvider();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [vaultPubKey, setVaultPubKey] = useState("");
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
        // router.push("/vault");
        console.log("Vault not initialized, run initializeVault()");
      } else {
        toast.error("Vault exists. No further action required.");
        setIsInitialized(true);
        console.log("Vault already exists, skip initialize");
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
          disabled={isLoading ? true : false}
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

          <h1 className="font-bold text-5xl mt-4">Avail Bal : 90.455 SOL</h1>
        </div>
      )}

      {isInitialized && (
        <div>
          <InteractingSol />
        </div>
      )}
      <div>{/* <TrustedBy /> */}</div>
    </div>
  );
}
