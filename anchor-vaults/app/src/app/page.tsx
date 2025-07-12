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

export default function Home() {
  const wallet = useWallet();
  const provider = useAnchorProvider();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

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
      console.log("Has fetch?:", typeof program.account.vaultState.fetch);
      console.log(Object.keys(program.account));
      if (!program.account.vaultState) {
        throw new Error("vault_state account not found in program.account");
      }
      const vaultAccount = await program.account.vaultState.fetch(vaultPubkey);
      console.log({ vaultAccount });

      if (!vaultAccount) {
        await initializeVault(program);

        toast.success("Yooo! dVault created!");
        router.push("/vault");
        console.log("Vault not initialized, run initializeVault()");
      } else {
        toast.error("Vault already exists ,skip initialize");
        console.log("Vault already exists, skip initialize");
      }
    } catch (e) {
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
    // <div className="w-screen h-[80vh] flex flex-col items-center justify-center  space-y-5">
    //   <h1 className="array-font md:text-6xl text-4xl text-center">
    //     Create, deposit, <br /> withdraw anytime.
    //   </h1>
    //   <Button
    //     onClick={handleCreateVault}
    //     className="bg-gradient-to-r from-green-500 to-green-600 text-white md:px-10 px-8 md:py-6 py-4 border-b-4 border-green-600 khand-font md:text-lg cursor-pointer"
    //   >
    //     {loading ? "Creating..." : "Create dVault"}
    //   </Button>
    // </div>
    // <div className="max-w-[50rem] m">
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

      <div>{/* <TrustedBy /> */}</div>
    </div>
  );
}
