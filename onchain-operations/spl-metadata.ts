import 'dotenv/config'
import wallet from './onchain-wallet-key.json' with { type: "json" };
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import {
    createMetadataAccountV3,
} from "@metaplex-foundation/mpl-token-metadata";
import type { CreateMetadataAccountV3InstructionAccounts, CreateMetadataAccountV3InstructionArgs, DataV2Args } from "@metaplex-foundation/mpl-token-metadata"
import { createSignerFromKeypair, signerIdentity, publicKey } from "@metaplex-foundation/umi";
import bs58 from 'bs58';


// Define our Mint address from "spl-init.ts" script
const mint = publicKey("Bixqv75HTEPcQasbSuHfd1s98f9nkVzsH25wTx7rR2Wi")


// Create a UMI connection
const RPC_URL = process.env.RPC_URL || "https://api.devnet.solana.com";

const umi = createUmi(RPC_URL, "confirmed");

const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(signerIdentity(signer));

(async () => {
    try {
        // Start here
        let accounts: CreateMetadataAccountV3InstructionAccounts = {
            mint,
            mintAuthority: signer,

        }

        let data: DataV2Args = {
            name: "Mars Travelers",
            symbol: "MARSTRAVEL",
            uri: "https://devnet.irys.xyz/CSjVDFKuGC18jZi4ikQdXB9ew9Hyp7diK3x6H34Qg9K1",
            sellerFeeBasisPoints: 100,
            creators: null,
            collection: null,
            uses: null,

        }

        let args: CreateMetadataAccountV3InstructionArgs = {
            data,
            isMutable: true,
            collectionDetails: null,
        }

        let tx = createMetadataAccountV3(
            umi,
            {
                ...accounts,
                ...args

            },

        )

        let result = await tx.sendAndConfirm(umi);
        console.log("See here : https://explorer.solana.com/tx/" + bs58.encode(result.signature) + "?cluster=devnet");
    } catch (e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();



/**
 * Signature for spl metadata creation:  
 * https://explorer.solana.com/tx/3imJxRjZY7tj3nXkq752rf46VvVBGTHA3Prctk4dJUXnrvuZ4tbZpVm3997wLAedV5wVz779QbAdBxarcQZvme2c?cluster=devnet
 */