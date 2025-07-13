"use client";
import { useEffect, useState } from "react";
import { AnimatedNumber } from "./ui/animated-number";

export function AnimatedNumberBasic({
  number,
  className,
}: {
  number: number;
  className?: string;
}) {
  const [value, setValue] = useState(0.0000001);

  useEffect(() => {
    setValue(number);
  }, [number]);

  return (
    <AnimatedNumber
      className={`inline-flex items-center  px-4 text-white  ${className}`}
      springOptions={{
        bounce: 0,
        duration: 2000,
      }}
      value={value}
    />
  );
}
