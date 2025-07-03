import 'dotenv/config';
import { Keypair, Connection } from "@solana/web3.js";
import { createMint, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import wallet from './onchain-wallet-key.json' with { type: 'json' };


const RPCURL = "http://localhost:8899";
// https://turbine-solanad-4cde.devnet.rpcpool.com/9a9da9cf-6db1-47dc-839a-55aca5c9c80a


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

