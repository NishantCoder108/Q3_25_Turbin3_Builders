"use client";
import { AnimatedNumberBasic } from "./AnimatedNumber";
import { useContext } from "react";
import { BalanceContext } from "@/context/BalContext";

export const SOLBalance = () => {
  const context = useContext(BalanceContext);
  const { walletBalance } = context;

  return (
    <div>
      {
        <p className="font-semibold text-white text-base flex items-center justify-center ">
          <AnimatedNumberBasic
            number={Number(walletBalance)}
            className="px-1 pl-3"
          />
          <span className="text-base hidden sm:block"> SOL </span>
        </p>
      }
    </div>
  );
};
