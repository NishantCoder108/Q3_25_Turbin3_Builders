import 'dotenv/config'
import wallet from './onchain-wallet-key.json' with { type: "json" };
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createSignerFromKeypair, signerIdentity, generateSigner, percentAmount, transactionBuilder } from "@metaplex-foundation/umi"
import { createNft, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import base58 from "bs58";


const RPC_URL = process.env.ALCHEMY_RPC_URL || "https://api.devnet.solana.com";

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
            name: "Plane Mars Travel",
            symbol: "PMT",
            // this is the metadata url from the metadata upload step
            uri: "https://gateway.irys.xyz/25EDWNQPUhjUtHBVhRYF51YrYirU72NdeaEM3eWXzgjR",
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




// import { createNft } from '@metaplex-foundation/mpl-token-metadata';
import { TransactionBuilder } from '@metaplex-foundation/umi';

async function mintNftWithCustomRetry() {
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
        try {
            const builder = transactionBuilder()
                .add(createNft(
                    umi, {
                    mint,
                    name: "Plane Mars Travel",
                    symbol: "PMT",
                    // this is the metadata url from the metadata upload step
                    uri: "https://gateway.irys.xyz/25EDWNQPUhjUtHBVhRYF51YrYirU72NdeaEM3eWXzgjR",
                    sellerFeeBasisPoints: percentAmount(10),
                    creators: [
                        {
                            address: myKeypairSigner.publicKey,
                            share: 100,
                            verified: true,
                        },
                    ],
                }

                ))
                .setBlockhash(await umi.rpc.getLatestBlockhash());

            const confirmResult = await builder.sendAndConfirm(umi);
            return confirmResult.signature;
        } catch (error) {
            attempts++;
            if (attempts === maxAttempts) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
        }
    }
}




// mintNftWithCustomRetry() // other way to mint


// Mint NFT on Solana Devnet
// https://explorer.solana.com/address/DP52DDXEwe6YXvWPsiyjFtjtLeC92vPTMj73fEBsZXfo/transfers?cluster=devnet