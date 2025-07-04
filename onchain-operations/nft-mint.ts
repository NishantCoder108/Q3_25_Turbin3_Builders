import 'dotenv/config'
import wallet from './onchain-wallet-key.json' with { type: "json" };
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createSignerFromKeypair, signerIdentity, generateSigner, percentAmount, transactionBuilder } from "@metaplex-foundation/umi"
import { createNft, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import base58 from "bs58";


const RPC_URL = process.env.RPC_URL || "https://api.devnet.solana.com";

const umi = createUmi(RPC_URL, "confirmed");

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));
umi.use(mplTokenMetadata())

const mint = generateSigner(umi);

(async () => {
    try {
        let tx = createNft(
            umi, {
            mint,
            name: "Infinity Clash",
            symbol: "CLASH",
            // this is the metadata url from the metadata upload step
            uri: "https://gateway.irys.xyz/ArTApwwyRFTeHH5iEcFtv8xZJyxhKCFd82eTSpW6TffN",
            sellerFeeBasisPoints: percentAmount(10),
            creators: [
                {
                    address: myKeypairSigner.publicKey,
                    share: 100,
                    verified: true,
                },
            ],
        }

        )
        let result = await tx.sendAndConfirm(umi);
        const signature = base58.encode(result.signature);

        console.log(`Succesfully Minted! Check out your TX here:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`)

        console.log("Mint Address: ", mint.publicKey);
    } catch (error) {

        console.log("Oops.. Something went wrong", error);
    }
})();

/**
 * * Infinity Clash NFT Metadata URI*
 * R1 :  Succesfully Minted! Check out your TX here:
https://explorer.solana.com/tx/3HucevVi2xduTdRRWDAH6BVY6kEdPF2agKdJxFCieibfi1yoV2pVHD2FkeUaReYiN8kNkN7SX32M3UEo66dQhRMi?cluster=devnet
Mint Address:  EAoXDVgknrEYi2D44aUoPFskHuP4ZD9sCx7GFhu7ykdB
 * 


 * * Plane Mars Travel NFT Metadata URI  *   
 * R2 :  https://explorer.solana.com/address/DP52DDXEwe6YXvWPsiyjFtjtLeC92vPTMj73fEBsZXfo/transfers?cluster=devnet
 */




