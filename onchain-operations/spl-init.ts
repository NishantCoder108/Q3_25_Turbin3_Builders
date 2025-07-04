import 'dotenv/config';
import { Keypair, Connection } from "@solana/web3.js";
import { createMint, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import wallet from './onchain-wallet-key.json' with { type: 'json' };


const RPCURL = process.env.RPC_URL || "https://api.devnet.solana.com";


const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
//Create a Solana devnet connection
const connection = new Connection(RPCURL, "confirmed");

(async () => {
    try {
        const mint = await createMint(
            connection,
            keypair, //payer
            keypair.publicKey, //mint authority
            null, //freeze authority
            6, //decimals
            undefined, // mint's keypair, defaults to a new random one
            {
                commitment: "confirmed",
            },
            TOKEN_2022_PROGRAM_ID // SPL Token program ID
        );
        console.log(`Mint created succssfully! 🎉 . \nMint Adress: ${mint.toBase58()}`);
        console.log("See here https://explorer.solana.com/address/" + mint.toBase58() + "?cluster=devnet");
    } catch (error) {
        console.log(`Oops, something went wrong: ${error}`);
    }
})();

// Mint Address: (Created by running this script)
// * BoWcEciASxYHicGQS8B66DGezbeXKSftMUBSPzG3HVd2
// * EUgLjd93Eonw6hk2tGfxRwEB56cgdwwgHdWSfdAD1eMg
// * ExUttmYkaNKjTPgg6yRkZdrdCH2VC1N5MDp7L424fCss
// * AcrbMJPCDVSkmoKHFwvbfziycKAjNYth5TMFBfefofh2


// * Transaction Hash:https://explorer.solana.com/address/AcrbMJPCDVSkmoKHFwvbfziycKAjNYth5TMFBfefofh2?cluster=devnet

/* After running this script, We will see the mint address printed in the console.
  - This mint address similar as USDC, USDT, related token addresses.
  - We can create Associated Token Account for this mint address to hold tokens.




  * Learned during importing file:
    - The `with { type: 'json' }` syntax is used to import JSON files in a way that allows TypeScript to understand the type of the imported data.
*/
