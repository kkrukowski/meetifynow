"use client"

import {Locale} from "@root/i18n.config.ts";
import Input from "@/components/Input";
import Title from "@/components/Title";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/Button.tsx";
import AnswerMeetingLoader from "@/routes/AnswerMeetingLoader.tsx";
import axios from "axios";

export default function LoginPage({ lang, dict }: { lang: Locale, dict: any }) {
    const [loginData, setLoginData] = useState({ email: "" as string, password: "" as string});

    const formSchema = yup.object().shape({
        email: yup.string().email().required(),
        password: yup.string().required()
    })

    type Inputs = {
        email: string;
        password: string;
    };


    const {
        register,
        handleSubmit,
        trigger,
        formState: { errors },
    } = useForm({ resolver: yupResolver(formSchema) });

    const login: SubmitHandler<Inputs> = async () => {

    };

    return <main className="flex md:flex-1 h-full flex-col px-5 py-10 pt-20 lg:p-20 lg:pt-28 h-smd:pt-20 lg:m-0 justify-center">
        <Title text={dict.page.login.title}/>
        <motion.div
            initial={{x: "50%", opacity: 0}}
            animate={{x: 0, opacity: 1}}
            transition={{duration: 0.3, ease: "easeInOut"}}
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
            />
        </motion.div>
        <div className="self-center">
            <Button text={dict.page.login.button.login} onClick={handleSubmit(login)()} className="mr-10"/>
        </div>
    </main>
}