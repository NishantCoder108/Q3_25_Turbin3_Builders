import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import wallet from "./dev-wallet.json";

const from = Keypair.fromSecretKey(new Uint8Array(wallet));
const to = new PublicKey("HiMmuCbieNgDNFd9GbcbVSHYPGPuEgZWwQxJULaJVoVs");
const connection = new Connection(
  "https://devnet.helius-rpc.com/?api-key=83b9a8f6-2e80-4b96-a446-b19647efe253"
);

(async () => {
  try {
    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: to,
        lamports: LAMPORTS_PER_SOL * 0.1,
      })
    );

    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    tx.feePayer = from.publicKey;

    const sig = await sendAndConfirmTransaction(connection, tx, [from]);
    console.log(`TX: https://explorer.solana.com/tx/${sig}?cluster=devnet`);
  } catch (e) {
    console.error(`Error: ${e}`);
  }
})();
