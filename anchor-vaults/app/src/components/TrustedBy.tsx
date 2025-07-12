import React from "react";
import Image from "next/image";

const TrustedBy = () => {
  return (
    <div className="flex flex-col items-center justify-center md:mt-20">
      <h1>Trusted By</h1>
      <div className="py-4">
        <Image
          src="/images/trustedby.png"
          alt="trustedby"
          width={900}
          height={400}
          className="invert hue-rotate-[180deg] "
        />
      </div>
    </div>
  );
};

export default TrustedBy;
