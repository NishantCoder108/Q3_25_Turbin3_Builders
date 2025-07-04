import 'dotenv/config'
import wallet from './onchain-wallet-key.json' with { type: "json" };
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"


const RPC_URL = process.env.ALCHEMY_RPC_URL || "https://api.devnet.solana.com";
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

        const image = "https://gateway.irys.xyz/A3N3Bo3Bhtg2dxVV1otmRdo63BMRnKs8wCMciq6t8Wnz"
        const metadata = {
            name: "Plane Mars Travel",
            symbol: "PMT",
            description: "Going to Mars",
            image,
            attributes: [
                { trait_type: 'Collection', value: 'Genesis' },
                { trait_type: 'Style', value: 'Modern' },
                { trait_type: 'Color', value: 'Blue' },
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
        console.log("Metadata URI: ", myUri); //MetaURI :  https://gateway.irys.xyz/25EDWNQPUhjUtHBVhRYF51YrYirU72NdeaEM3eWXzgjR  
    }
    catch (error) {
        console.log("Oops.. Something went wrong", error);
    }
})();

