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
import {
  getVaultPDA,
  getVaultProgram,
  getVaultStatePDA,
  withdraw,
} from "@/utils/anchor_vaults";
import { useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
export default function WithdrawDialog() {
  const wallet = useWallet();
  const provider = useAnchorProvider();
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleWithdraw = async () => {
    try {
      setLoading(true);
      if (!wallet.publicKey) {
        return toast.error("Please connect your wallet to create vault");
      }

      const program = getVaultProgram(provider);

      const vaultState = getVaultStatePDA(wallet.publicKey, program.programId);
      const vault = getVaultPDA(vaultState, program.programId);

      // get total SOL in the vault account
      const rawBalance = await provider.connection.getBalance(vault);

      // get rent-exempt minimum for a system account (no data)
      const rentExempt =
        await provider.connection.getMinimumBalanceForRentExemption(10);

      // Usable balance (if negative, clamp to 0)
      const usableBalanceLamports = Math.max(rawBalance - rentExempt, 0);

      if (amount <= 0) {
        return toast.error("Amount need to be greater than 0");
      }

      if (amount > usableBalanceLamports / LAMPORTS_PER_SOL) {
        return toast.error(`you cant take the fund you dont have!`);
      }

      const amountInSol = amount * LAMPORTS_PER_SOL;
      await withdraw(amountInSol, program);

      toast.success("Yooo! You just made you withdrawal!");
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
          <Button variant={"outline"}>Withdraw</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Withdraw SOL</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                name="amount"
                value={amount}
                type="number"
                onChange={(e) => setAmount(parseInt(e.target.value))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleWithdraw}>
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Withdraw"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
