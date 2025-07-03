import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import walletKeypair from "./onchain-wallet-key.json" with { type: "json" };

// *Generating Keypair:
// const keypair = Keypair.generate();

// console.log(`Public Key: ${keypair.publicKey.toBase58()}`);
// console.log(`[${keypair.secretKey}]`);



// Requesting Airdrop
const keypair = Keypair.fromSecretKey(new Uint8Array(walletKeypair));
const connection = new Connection("http://localhost:8899", "confirmed");

(async () => {
  try {
    console.log(`Public Key: ${keypair.publicKey.toBase58()}`);
    const txhash = await connection.requestAirdrop(
      keypair.publicKey,
      200 * LAMPORTS_PER_SOL
    );
    console.log(`TX: https://explorer.solana.com/tx/${txhash}?cluster=localhost`);
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();



// *Checking Balance:
// (async () => {
//   try {
//     console.log(`Public Key: ${keypair.publicKey.toBase58()}`);
//     const txhash = await connection.getBalance(keypair.publicKey);
//     console.log(`Solana Balance : ${txhash / LAMPORTS_PER_SOL} SOL`);
//   } catch (e) {
//     console.error(`Oops, something went wrong: ${e}`);
//   }
// })();