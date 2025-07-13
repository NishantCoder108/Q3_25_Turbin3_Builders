"use client";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletIcon } from "lucide-react";
import { SOLBalance } from "./WalletBalance";
import dynamic from "next/dynamic";

const LABELS = {
  "change-wallet": "Change wallet",
  connecting: "Connecting ...",
  "copy-address": "Copy address",
  copied: "Copied",
  disconnect: "Disconnect",
  "has-wallet": "Connect",
  "no-wallet": "Connect Wallet",
} as const;

const ConnectWallet = () => {
  const wallet = useWallet();
  const isWalletConnected = wallet.connected;

  return (
    <div className="flex items-center justify-center sm:gap-3">
      <div className=" flex items-center text-white   ">
        {isWalletConnected && (
          <>
            <WalletIcon className=" h-4 w-4  hidden   sm:block" />
            <SOLBalance />{" "}
          </>
        )}
      </div>
      <WalletModalProvider>
        <div className="flex items-center justify-between">
          <BaseWalletMultiButtonDynamic
            style={isWalletConnected ? connectedStyle : disconnectedStyle}
            labels={LABELS}
          />
        </div>
      </WalletModalProvider>
    </div>
  );
};

const connectedStyle = {
  background: "#522AA5",
  borderRadius: "2rem",
  maxWidth: "400px",
  color: "#fff",
  // width: "10rem",
  fontSize: "1rem",
  height: "2.5rem",
  cursor: "pointer",
};
const disconnectedStyle = {
  background: "#522AA5",
  borderRadius: "2rem",
  maxWidth: "400px",
  // width: "10rem",
  color: "#fff",
  fontSize: "1rem",
  height: "2.5rem",
  cursor: "pointer",
};

const BaseWalletMultiButtonDynamic = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.BaseWalletMultiButton
    ),
  { ssr: false }
);

export default ConnectWallet;

// "use client";

// // import { Vault } from "lucide-react";
// import dynamic from "next/dynamic";
// import { useWallet } from "@solana/wallet-adapter-react";
// import { PublicKey } from "@solana/web3.js";

// export default function ConnectWallet() {
//   const wallet = useWallet();
//   const isWalletConnected = wallet.connected;

//   function getPubkeyShortString(pubkey: PublicKey) {
//     const pk = pubkey.toString();
//     const startStr = pk.slice(0, 3);
//     const endStr = pk.slice(pk.length - 4, pk.length);

//     return { pubkey: `${startStr}..${endStr}` };
//   }

//   return (
//     <>
//       {/* <Vault className="w-10 h-10 text-black" /> */}
//       <WalletMultiButtonDynamic
//         style={{
//           background: "#522AA5",
//           borderRadius: "2rem",
//           maxWidth: "400px",
//           textWrap: "wrap",
//           color: "#fff",
//           fontSize: "1rem",
//           height: "2.5rem",
//         }}
//       >
//         {`${
//           isWalletConnected
//             ? wallet.publicKey
//               ? getPubkeyShortString(wallet.publicKey).pubkey
//               : "Loading..."
//             : "Connect Wallet"
//         }`}
//       </WalletMultiButtonDynamic>
//     </>
//   );
// }

// const WalletMultiButtonDynamic = dynamic(
//   () =>
//     import("@solana/wallet-adapter-react-ui").then(
//       (mod) => mod.WalletMultiButton
//     ),
//   { ssr: false }
// );
