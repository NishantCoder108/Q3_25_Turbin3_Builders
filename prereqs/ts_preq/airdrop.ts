import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import wallet from "./dev-wallet.json";

const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
// const connection = new Connection("https://api.devnet.solana.com");
const connection = new Connection("https://api.devnet.solana.com");

(async () => {
  try {
    console.log(`Public Key: ${keypair.publicKey.toBase58()}`);
    // console.log(`Secret Key: [${keypair.secretKey.toString()}]`);
    const txhash = await connection.requestAirdrop(
      keypair.publicKey,
      2 * LAMPORTS_PER_SOL
    );
    console.log(`TX: https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
