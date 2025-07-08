"use client";

import Heading from "@/components/Heading";

import { useEffect, useState } from "react";

export default function VerifyEmail() {
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const handle = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");

        if (token) {
          setIsVerified(true);
        }
      } catch (err) {
        console.error(err);
      }
    };
    handle();
  }, [setIsVerified]);

  return (
    <div className="flex flex-1 flex-col justify-center items-center h-full">
      <Heading text={isVerified ? "Zweryfikowano" : "Weryfikowanie..."} />
    </div>
  );
}
