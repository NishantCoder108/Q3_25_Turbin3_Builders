"use client";
import { Button } from "@/components/ui/button";
import { useAnchorProvider } from "@/hooks/useAnchorProvider";
import { getVaultProgram, initializeVault } from "@/utils/anchor_vaults";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const wallet = useWallet();
  const provider = useAnchorProvider();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleCreateVault = async () => {
    try {
      if (!wallet.publicKey) {
        toast.error("Please connect your wallet to create vault");
        return;
      }
      setLoading(true);

      const program = getVaultProgram(provider);

      await initializeVault(program);
      toast.success("Yooo! dVault created!");
      router.push("/vault");
    } catch (e) {
      console.error("error creating vault : ", e);
      console.warn("Error creating vault");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-screen h-[80vh] flex flex-col items-center justify-center bg-white space-y-5">
      <h1 className="array-font md:text-6xl text-4xl text-center">
        Create, deposit, <br /> withdraw anytime.
      </h1>
      <Button
        onClick={handleCreateVault}
        className="bg-gradient-to-r from-green-500 to-green-600 text-white md:px-10 px-8 md:py-6 py-4 border-b-4 border-green-600 khand-font md:text-lg cursor-pointer"
      >
        {loading ? "Creating..." : "Create dVault"}
      </Button>
    </div>
  );
}
