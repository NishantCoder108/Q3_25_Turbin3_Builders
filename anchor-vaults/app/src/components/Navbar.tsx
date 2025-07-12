import React from "react";
import Image from "next/image";
import ConnectWallet from "./ConnectWallet";
const Navbar = () => {
  return (
    <div className="flex items-center justify-between w-full md:p-8 sm:p-4 max-w-svw">
      <div>
        <Image src="/images/logo.svg" alt="logo" width={100} height={100} />
      </div>
      <div className="text-white text-base">
        <ConnectWallet />
      </div>
    </div>
  );
};

export default Navbar;
