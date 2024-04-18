"use client"

import Input from "@/components/Input";
import Title from "@/components/Title";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import React, { useState, useTransition } from "react";
import { motion } from "framer-motion";
import Button from "@/components/Button.tsx";
import {SocialButton} from "@/components/Auth/SocialButton.tsx";
import {
    faGithub,
    faGoogle
} from "@fortawesome/free-brands-svg-icons";
import { LinkButton } from "@/components/LinkButton.tsx";
import * as yup from "yup";
import { LoginInputs } from "@/inputs";
import {login} from "@/api/login.ts";
import {FormError} from "@/components/FormError.tsx";

export default function LoginPage({ dict }: { dict: any }) {
    const [error, setError] = useState<string | undefined>("" as string);
    const [success, setSuccess] = useState<string | undefined>("" as string);
    const [isPending, startTransition] = useTransition();

    const [loginData, setLoginData] = useState({ email: "" as string, password: "" as string});

    const formSchema = yup.object().shape({
        email: yup.string().email(dict && dict.page.auth.error.email.email).required(dict && dict.page.auth.error.email.required),
        password: yup.string().required(dict && dict.page.auth.error.password.required).min(6, dict && dict.page.auth.error.password.min),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(formSchema) });

    const loginHandler: SubmitHandler<LoginInputs> = async () => {
        startTransition(async () => {
            const res = await login(loginData)

            console.log(res)

            // setError(res.error)
            // setSuccess(res.success)
        })
    };

    return <main className="flex md:flex-1 h-full flex-col px-5 py-10 pt-20 lg:p-20 lg:pt-28 h-smd:pt-20 lg:m-0 justify-center items-center">
        <Title text={dict.page.login.title}/>
        <form>
            {/*Credentials login*/}
            <motion.div
                initial={{x: "50%", opacity: 0}}
                animate={{x: 0, opacity: 1}}
                transition={{duration: 0.3, ease: "easeInOut"}}
                className="flex flex-col w-full justify-center items-center"
            >
                <Input
                    label={dict.page.auth.input.email.label}
                    type="email"
                    id="email"
                    name="email"
                    onChange={(e: {
                        target: { value: React.SetStateAction<string> };
                    }) =>
                        setLoginData({
                            ...loginData,
                            email: e.target.value.toString(),
                        })
                    }
                    required={true}
                    placeholder={dict.page.auth.input.email.placeholder}
                    register={register}
                    error={!!errors.email}
                    errorText={errors.email?.message?.toString()}
                    disabled={isPending}
                />
                <Input
                    label={dict.page.auth.input.password.label}
                    type="password"
                    id="password"
                    name="password"
                    onChange={(e: {
                        target: { value: React.SetStateAction<string> };
                    }) =>
                        setLoginData({
                            ...loginData,
                            password: e.target.value.toString(),
                        })
                    }
                    required={true}
                    placeholder={dict.page.auth.input.password.placeholder}
                    register={register}
                    error={!!errors.password}
                    errorText={errors.password?.message?.toString()}
                    disabled={isPending}
                />
                {error && <FormError text={error} error={true}/>}
                {success && <FormError text={success} error={false}/>}

                <div className="self-center w-full">
                    <Button text={dict.page.login.button.login} onClick={handleSubmit(loginHandler)} className="w-full"/>
                </div>
                <div className="flex flex-row w-full justify-center items-center py-5">
                    <div className="w-full h-0.5 rounded-full bg-gray"></div>
                    <p className="whitespace-nowrap px-4 text-gray">{dict.page.login.socialLogin.text}</p>
                    <div className="w-full h-0.5 rounded-full bg-gray"></div>
                </div>

                {/*Social Login*/}
                <div className="flex justify-center gap-5">
                    <SocialButton onClick={() => {
                    }} icon={faGoogle}/>
                    <SocialButton onClick={() => {
                    }} icon={faGithub}/>
                </div>

                {/*Create account*/}
                <div className="flex flex-row justify-center mt-5">
                    <p className="mr-1">{dict.page.login.createAccount.text}</p>
                    <LinkButton href="/register" target="_self" text={dict.page.login.createAccount.link}/>
                </div>
            </motion.div>
        </form>
    </main>
}