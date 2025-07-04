import 'dotenv/config'
import wallet from './onchain-wallet-key.json' with { type: "json" };
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createGenericFile,
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { readFileSync } from 'fs';


const RPC_URL = process.env.RPC_URL || "https://api.devnet.solana.com";
console.log("RPC URL: ", RPC_URL);

const umi = createUmi(RPC_URL, "confirmed");

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

// umi.use(irysUploader());//for mainnet
umi.use(irysUploader({ address: "https://devnet.irys.xyz/" }));
umi.use(signerIdentity(signer));

(async () => {
  console.log("Uploading Image...");
  try {
    //1. Load image
    // const image = await readFileSync("./plane.png");
    const image = await readFileSync("/home/nishant/Downloads/punch_thanos.gif");
    //2. Convert image to generic file.
    let genericFile = createGenericFile(image, "thanos_punch.gif", {
      contentType: "image/png",
    });
    //3. Upload image
    const [myUri] = await umi.uploader.upload([genericFile]);
    console.log("image URI: ", myUri);
  } catch (error) {
    console.log("Oops.. Something went wrong", error);
  }
})();



// // https://gateway.irys.xyz/A3N3Bo3Bhtg2dxVV1otmRdo63BMRnKs8wCMciq6t8Wnz
// // https://gateway.irys.xyz/CSjVDFKuGC18jZi4ikQdXB9ew9Hyp7diK3x6H34Qg9K1
// https://gateway.irys.xyz/FYeuTv1q95qB9Tu8RsNaQJGCcaNjd4rCxr9jG4816jUC

//irys is fast compared to arweave
