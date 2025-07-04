import 'dotenv/config'
import wallet from './onchain-wallet-key.json' with { type: "json" };
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"


const RPC_URL = process.env.RPC_URL || "https://api.devnet.solana.com";
console.log("RPC URL: ", RPC_URL);

const umi = createUmi(RPC_URL, "confirmed");

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader({ address: "https://devnet.irys.xyz/" }));
umi.use(signerIdentity(signer));

(async () => {
    try {
        // Follow this JSON structure
        // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure

        const image = "https://gateway.irys.xyz/FYeuTv1q95qB9Tu8RsNaQJGCcaNjd4rCxr9jG4816jUC"
        const metadata = {
            name: "Infinity Clash",
            symbol: "CLASH",
            description: "A legendary moment where Thanos faces the mightiest heroes of the universe. Power. Rage. Destiny.",
            image,
            attributes: [
                { trait_type: 'Universe', value: 'Marvel' },
                { trait_type: 'Battle', value: 'Endgame' },
                { trait_type: 'Hero', value: 'Iron Man' },
                { trait_type: 'Villain', value: 'Thanos' },
                { trait_type: 'Power Stone Used', value: 'Yes' }
            ],
            properties: {
                files: [
                    {
                        type: "image/png",
                        uri: image
                    },
                ]
            },
            creators: []
        };

        // upload metadata to the blockchain

        const myUri = await umi.uploader.uploadJson(metadata);
        console.log("Metadata URI: ", myUri);
    }
    catch (error) {
        console.log("Oops.. Something went wrong", error);
    }
})();


/**
 * 
 * *Plane Mars Travel NFT Metadata URI*
 * MetaURI :  https://gateway.irys.xyz/25EDWNQPUhjUtHBVhRYF51YrYirU72NdeaEM3eWXzgjR  
 * 
 * *Infinity Clash NFT Metadata URI*
 * MetaURI :  https://gateway.irys.xyz/ArTApwwyRFTeHH5iEcFtv8xZJyxhKCFd82eTSpW6TffN
 */