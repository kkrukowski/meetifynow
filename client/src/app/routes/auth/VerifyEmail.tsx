"use client"

import { getDictionary } from "@/lib/dictionary";
import { Locale } from "@root/i18n.config";

import BigText from "@/components/BigText";
import Button from "@/components/Button";
import Heading from "@/components/Heading";

import { getLocale } from "@/utils/getWebLocale";
import Link from "next/link";
import {useEffect, useState} from "react";
import {verifyEmail} from "@/api/verifyemail.ts";

export default function VerifyEmail({ dict }: { dict: any }) {
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        const handle = async () => {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const token = urlParams.get("token");

                if (token) {
                    const res = await verifyEmail(token);
                    setIsVerified(true);
                }
            } catch (err) {
                console.error(err);
            }
        }
        handle();
    }, [setIsVerified])

    return (
        <div className="flex flex-1 flex-col justify-center items-center h-full">
            <Heading text={isVerified ? "Zweryfikowano" : "Weryfikowanie..."} />
        </div>
    );
}
