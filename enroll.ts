import "dotenv/config";
import { Connection, Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { AnchorProvider, Wallet, Program } from "@coral-xyz/anchor";
import { IDL } from "./programs/Turbin3_prereq";
import type { Turbin3Prereq } from "./programs/Turbin3_prereq";
// import wallet from "./Turbin3-wallet.json";
import bs58 from "bs58";

const base58Key = process.env.PRIVATE_KEY!;
const secretKey = bs58.decode(base58Key);
const keypair = Keypair.fromSecretKey(secretKey);

console.log(keypair.publicKey.toBase58());

// const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
const connection = new Connection(
  "https://devnet.helius-rpc.com/?api-key=83b9a8f6-2e80-4b96-a446-b19647efe253"
);
const provider = new AnchorProvider(connection, new Wallet(keypair), {
  commitment: "confirmed",
});

const programId = new PublicKey("TRBZyQHB3m68FGeVsqTK39Wm4xejadjVhP5MAZaKWDM");
const program: Program<Turbin3Prereq> = new Program(IDL, provider);

// const program: Program<Turbin3Prereq> = new Program(
//   IDL,
//   new PublicKey("TRBZyQHB3m68FGeVsqTK39Wm4xejadjVhP5MAZaKWDM"),
//   provider
// );

const accountSeeds = [Buffer.from("prereqs"), keypair.publicKey.toBuffer()];
const [accountKey, _account_bump] = PublicKey.findProgramAddressSync(
  accountSeeds,
  program.programId
);

const mintCollection = new PublicKey(
  "5ebsp5RChCGK7ssRZMVMufgVZhd2kFbNaotcZ5UvytN2"
);
const mintTs = Keypair.generate();
const MPL_CORE_PROGRAM_ID = new PublicKey(
  "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"
);

// Step 1: Initialize
(async () => {
  try {
    const txhash = await program.methods
      .initialize("nishantcoder108")
      .accountsPartial({
        user: keypair.publicKey,
        account: accountKey,
        system_program: SystemProgram.programId,
      })
      .signers([keypair])
      .rpc();

    console.log(
      `Initialize TX: https://explorer.solana.com/tx/${txhash}?cluster=devnet`
    );
  } catch (e) {
    console.error(`Init Error: ${e}`);
  }
})();

// // Step 2: Submit TS
// (async () => {
//   try {
//     const txhash = await program.methods
//       .submitTs()
//       .accountsPartial({
//         user: keypair.publicKey,
//         account: accountKey,
//         mint: mintTs.publicKey,
//         collection: mintCollection,
//         authority: keypair.publicKey, // this might be PDA instead (check!)
//         mplCoreProgram: MPL_CORE_PROGRAM_ID,
//         systemProgram: SystemProgram.programId,
//       })
//       .signers([keypair, mintTs])
//       .rpc();

//     console.log(
//       `SubmitTX: https://explorer.solana.com/tx/${txhash}?cluster=devnet`
//     );
//   } catch (e) {
//     console.error(`Submit Error: ${e}`);
//   }
// })();
