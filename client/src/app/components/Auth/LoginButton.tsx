"use client"

import React from "react";
import { useRouter } from "next/navigation"
import Button from "@/components/Button.tsx";

interface LoginButtonProps {
    mode?: "modal" | "redirect";
    asChild?: boolean;
    onClick?: () => void;
    text: string;
}

export const LoginButton = ({mode = "modal", text, onClick}: LoginButtonProps) => {
    const router = useRouter();

    const redirectToLoginPage = () => {
        router.push("/login")
    }

    return (
        <Button onClick={mode == "redirect" ? redirectToLoginPage : onClick} text={text} className={mode == "modal" ? "w-full mt-5" : ""} />
    );
}