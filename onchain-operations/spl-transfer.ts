import 'dotenv/config'
import wallet from './onchain-wallet-key.json' with { type: "json" };
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

const RPC_URL = process.env.RPC_URL || "https://api.devnet.solana.com";

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const connection = new Connection(RPC_URL, "confirmed");

// Mint address
const mint = new PublicKey("Bixqv75HTEPcQasbSuHfd1s98f9nkVzsH25wTx7rR2Wi");

// Recipient address
const to = new PublicKey("HiMmuCbieNgDNFd9GbcbVSHYPGPuEgZWwQxJULaJVoVs");

(async () => {
    try {
        // Get the token account of the fromWallet address, and if it does not exist, create it
        const fromWallet = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            keypair.publicKey
        )
        console.log("From Wallet: ", fromWallet.address);

        // Get the token account of the toWallet address, and if it does not exist, create it
        const toWallet = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            to,
        );
        console.log("ToWallet: ", toWallet.address);

        // Transfer the new token to the "toTokenAccount" we just created
        const transferID = await transfer(
            connection,
            keypair,
            fromWallet.address,
            toWallet.address,
            keypair,
            BigInt(1_000_000),
        );
        console.log("Transfer ID: ", transferID);
    } catch (e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();


/**
 * Mint Address: Bixqv75HTEPcQasbSuHfd1s98f9nkVzsH25wTx7rR2Wi
 * Signature for SPL Token Transfer: 
 * https://explorer.solana.com/tx/3prcyrhCZEG7HB7WjMxjgdGJcSWRbahbD7B9e1DgzsixRnG7fd6kKuLPvdyvadwFeYzZVreF7bvCRuha3r4Bjb9S?cluster=devnet
 */