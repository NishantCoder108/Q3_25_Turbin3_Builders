import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { closeVault, getVaultProgram } from "@/utils/anchor_vaults";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAnchorProvider } from "@/hooks/useAnchorProvider";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
export default function CloseDialog() {
  const wallet = useWallet();
  const provider = useAnchorProvider();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleClose = async () => {
    try {
      setLoading(true);
      if (!wallet.publicKey) {
        toast.error("Please connect your wallet to create vault");
      }
      const program = getVaultProgram(provider);

      await closeVault(program);

      toast.success("Ughhh! You just closed your account");
      router.push("/");
    } catch (e) {
      console.error("error closing the vault : ", e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"destructive"}>Close Vault</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            vault and send all the remaining sol to your wallet.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant={"destructive"} onClick={handleClose}>
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Close the Vault"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
