"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAnchorProvider } from "@/hooks/useAnchorProvider";
import { deposit, getVaultProgram } from "@/utils/anchor_vaults";
import { useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function DepositDialog() {
  const wallet = useWallet();
  const provider = useAnchorProvider();
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleDeposit = async () => {
    try {
      setLoading(true);
      if (!wallet.publicKey) {
        toast.error("Please connect your wallet to create vault");
      }
      const program = getVaultProgram(provider);

      if (amount <= 0) {
        return toast.error("Amount need to be greater than 0");
      }

      const amountInSol = amount * LAMPORTS_PER_SOL;

      await deposit(amountInSol, program);

      toast.success("Yooo! You just made your deposit!");
      location.reload();
    } catch (e) {
      console.error("error depositing fund to vault : ", e);
      console.warn("Error creating vault");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button>Deposit</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Deposit SOL</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                name="amount"
                value={amount}
                type="number"
                step="any" // This allows decimals in the input
                onChange={(e) => setAmount(parseFloat(e.target.value))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleDeposit}>
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Deposit"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
