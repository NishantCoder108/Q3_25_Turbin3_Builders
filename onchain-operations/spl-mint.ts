import 'dotenv/config'
import wallet from './onchain-wallet-key.json' with { type: "json" };
import { Keypair, PublicKey, Connection } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';

const RPC_URL = process.env.RPC_URL || "https://api.devnet.solana.com";

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const connection = new Connection(RPC_URL, "confirmed");

const token_decimals = BigInt(1_000_00000); //Total supply of the token 

// Mint address
const mint = new PublicKey("Bixqv75HTEPcQasbSuHfd1s98f9nkVzsH25wTx7rR2Wi"); //Program Id, not in PROGRRAM 2022

(async () => {
    try {
        // Create an ATA
        // const ata = ???
        // console.log(`Your ata is: ${ata.address.toBase58()}`);

        const ata = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            keypair.publicKey,

        );
        console.log(`✅ Token ATA is: ${ata.address.toBase58()}`);

        // Mint to ATA
        // const mintTx = ???
        // console.log(`Your mint txid: ${mintTx}`);

        // Mint to ATA
        const mintTx = await mintTo(
            connection,
            keypair,
            mint,
            ata.address,
            keypair.publicKey,
            token_decimals // notice how the numbers of zeros here must match the decimal in the mint
            // for each to equal one full unit of the token minted from the Mint Account
            // so in our case, since the decimal value was 6, to get a whole unit of the token, 
            // we must set 1e6, (1_000_000n), 
        );
        console.log(`✅ Your Mint txid: ${mintTx}`);
    } catch (error) {
        console.log(`Oops, something went wrong: ${error}`)
    }
})()


/**
 * ATA CREATED :  ✅ Token ATA is: DdVwUNgia6CbCPQgdUjk9vhCjiYsgiguh1VfotnKux6y
 * MINT Address at Default Program ID : 2oUu1sZswhdojT95zFbMtA8LTUC1Hw7hBfubGgyCdikk
 * Signature: ✅ Your Mint txid: 2SQEvpPjBE7BvvaTTbfkQLq1GNb1yWbDapXCgAdDBGW642Pyej5ZGiiZbBkzfFpYyCndLHoQ3oQYrPKsg9BUvTWQ
 */