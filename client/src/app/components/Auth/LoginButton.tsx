"use client"

import React from "react";
import { useRouter } from "next/navigation"
import Button from "@/components/Button.tsx";

interface LoginButtonProps {
    mode?: "modal" | "redirect";
    asChild?: boolean;
    text: string;
}

export const LoginButton = ({mode = "modal", text}: LoginButtonProps) => {
    const router = useRouter();

    const onClick = () => {
        router.push("/auth/login")
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