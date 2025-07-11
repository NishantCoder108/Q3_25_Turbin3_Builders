"use client";

import { Vault } from "lucide-react";
import dynamic from "next/dynamic";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";

export default function Appbar() {
  const wallet = useWallet();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  function getPubkeyShortString(pubkey: PublicKey) {
    const pk = pubkey.toString();
    const startStr = pk.slice(0, 3);
    const endStr = pk.slice(pk.length - 4, pk.length);

    return { pubkey: `${startStr}..${endStr}` };
  }
  return (
    <header className="w-full flex items-center justify-between md:px-48 px-5 bg-white py-8">
      <Vault className="w-10 h-10 text-black" />
      <WalletMultiButtonDynamic
        style={{
          background: "white",
          border: "2px solid #cecece",
          borderRadius: "15px",
          maxWidth: "400px",
          textWrap: "wrap",
          color: "#020202",
          fontSize: "13px",
        }}
      >
        {`${
          isClient
            ? wallet.publicKey
              ? getPubkeyShortString(wallet.publicKey).pubkey
              : "Connect wallet"
            : "Loading..."
        }`}
      </WalletMultiButtonDynamic>
    </header>
  );
}

const WalletMultiButtonDynamic = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
);
