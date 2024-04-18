"use client"

import React from "react";
import { useRouter } from "next/navigation"
import Button from "@/components/Button.tsx";

interface SignInButtonProps {
    mode?: "modal" | "redirect";
    asChild?: boolean;
    text: string;
}

export const SignInButton = ({mode = "modal", text}: SignInButtonProps) => {
    const router = useRouter();

    const onClick = () => {
        router.push("/login")
    }

    if (mode === "modal") {
        return (
            <p>TODO: Implement modal login</p>
        );
    }


    return (
        <Button onClick={onClick} text={text} className="mt-0"/>
    );
}