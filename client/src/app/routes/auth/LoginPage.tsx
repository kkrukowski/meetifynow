"use client"

import {Locale} from "@root/i18n.config.ts";
import Input from "@/components/Input";
import Title from "@/components/Title";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/Button.tsx";
import {SocialButton} from "@/components/Auth/SocialButton.tsx";
import {
    faGithub,
    faGoogle
} from "@fortawesome/free-brands-svg-icons";
import LinkButton from "@/components/LinkButton.tsx";

export default function LoginPage({ lang, dict }: { lang: Locale, dict: any }) {
    const [loginData, setLoginData] = useState({ email: "" as string, password: "" as string});

    const formSchema = yup.object().shape({
        email: yup.string().email(dict.page.login.error.email.email).required(dict.page.login.error.email.required),
        password: yup.string().required(dict.page.login.error.password.required).min(6, dict.page.login.error.password.min),
    })

    type Inputs = {
        email: string;
        password: string;
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(formSchema) });

    const login: SubmitHandler<Inputs> = async () => {
        console.log(loginData);
    };

    return <main className="flex md:flex-1 h-full flex-col px-5 py-10 pt-20 lg:p-20 lg:pt-28 h-smd:pt-20 lg:m-0 justify-center">
        <Title text={dict.page.login.title}/>
        {/*Credentials login*/}
        <motion.div
            initial={{x: "50%", opacity: 0}}
            animate={{x: 0, opacity: 1}}
            transition={{duration: 0.3, ease: "easeInOut"}}
            className="flex flex-col w-full justify-center items-center"
        >
            <Input
                label={dict.page.login.input.email.label}
                type="text"
                id="email"
                onChange={(e: {
                    target: { value: React.SetStateAction<string> };
                }) =>
                    setLoginData({
                        ...loginData,
                        email: e.target.value.toString(),
                    })
                }
                required={true}
                placeholder={dict.page.login.input.email.placeholder}
                register={register}
                error={!!errors.email}
                errorText={errors.email?.message?.toString()}
            />
            <Input
                label={dict.page.login.input.password.label}
                type="text"
                id="password"
                onChange={(e: {
                    target: { value: React.SetStateAction<string> };
                }) =>
                    setLoginData({
                        ...loginData,
                        password: e.target.value.toString(),
                    })
                }
                required={true}
                placeholder={dict.page.login.input.password.placeholder}
                register={register}
                error={!!errors.password}
                errorText={errors.password?.message?.toString()}
            />
        </motion.div>
        <div className="self-center w-full">
            <Button text={dict.page.login.button.login} onClick={handleSubmit(login)} className="w-full"/>
        </div>
        <div className="flex flex-row w-full justify-center items-center py-5">
            <div className="w-full h-0.5 rounded-full bg-gray"></div>
            <p className="whitespace-nowrap px-4 text-gray">{dict.page.login.socialLogin.text}</p>
            <div className="w-full h-0.5 rounded-full bg-gray"></div>
        </div>
        {/*Social Login*/}
        <div className="flex justify-center gap-5">
            <SocialButton onClick={() => {}} icon={faGoogle}/>
            <SocialButton onClick={() => {}} icon={faGithub}/>
        </div>
        {/*Create account*/}
        <div className="flex flex-row justify-center mt-5">
            <p className="mr-1">{dict.page.login.createAccount.text}</p>
            <LinkButton href="/register" text={dict.page.login.createAccount.link} />
        </div>
    </main>
}