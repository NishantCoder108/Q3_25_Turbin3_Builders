import 'dotenv/config'
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import walletKeypair from "./onchain-wallet-key.json" with { type: "json" };
import bs58 from "bs58";
// *Generating Keypair:
// const keypair = Keypair.generate();

// console.log(`Public Key: ${keypair.publicKey.toBase58()}`);
// console.log(`[${keypair.secretKey}]`);

const RPC_URL = process.env.ALCHEMY_RPC_URL || "https://api.devnet.solana.com";
console.log("RPC URL: ", RPC_URL);


// Requesting Airdrop
const keypair = Keypair.fromSecretKey(new Uint8Array(walletKeypair));
const connection = new Connection(RPC_URL, "confirmed");

// (async () => {
//   try {
//     console.log(`Public Key: ${keypair.publicKey.toBase58()}`);
//     const txhash = await connection.requestAirdrop(
//       keypair.publicKey,
//       2 * LAMPORTS_PER_SOL
//     );
//     console.log(`TX: https://explorer.solana.com/tx/${txhash}?cluster=localhost`);
//   } catch (e) {
//     console.error(`Oops, something went wrong: ${e}`);
//   }
// })();



// *Checking Balance:
// (async () => {
//   try {
//     console.log(`Public Key: ${keypair.publicKey.toBase58()}`);
//     const lam = await connection.getBalance(new PublicKey("ExUttmYkaNKjTPgg6yRkZdrdCH2VC1N5MDp7L424fCss"));
//     console.log(`Solana Balance : ${lam / LAMPORTS_PER_SOL} SOL`);
//   } catch (e) {
//     console.error(`Oops, something went wrong: ${e}`);
//   }
// })();


// Walllet's Unitarray to base58 string
let walletBase58 = Keypair.fromSecretKey(new Uint8Array(walletKeypair));
console.log("Wallet Base58: ", walletBase58.publicKey.toBase58());
console.log("Wallet Secrete Key: ", bs58.encode(walletBase58.secretKey));