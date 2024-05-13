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
import { RegisterInputs } from "@/inputs";
import { FormError } from "@/components/FormError.tsx";
import { register as registerUserApi } from "@/api/register.ts";

export default function RegisterPage({ dict }: { dict: any }) {
    const [error, setError] = useState<string | undefined>("" as string);
    const [success, setSuccess] = useState<string | undefined>("" as string);
    const [isPending, startTransition] = useTransition();

    const [registerData, setRegisterData] = useState({ name: "" as string, email: "" as string, password: "" as string});

    const formSchema = yup.object().shape({
        email: yup.string().email(dict && dict.page.auth.error.email.email).required(dict && dict.page.auth.error.email.required),
        password: yup.string().required(dict && dict.page.auth.error.password.required).min(8, dict && dict.page.auth.error.password.min).matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-.]).{8,}$/, dict && dict.page.auth.error.password.match),
        name: yup.string().required(dict && dict.page.auth.error.name.required).min(2, dict && dict.page.auth.error.name.min),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(formSchema) });

    const registerHandler: SubmitHandler<RegisterInputs> = async () => {
        setError("")
        setSuccess("")
        startTransition(async () => {
            const res = await registerUserApi(registerData)

            if(res.statusCode === 400 && res.message === "User already exists!") {
                return setError(dict.page.auth.error.userExists)
            }

            if(res.statusCode === 201 && res.message === "User created") {
                // Clear form
                setRegisterData({ name: "", email: "", password: "" })
                return setSuccess(dict.page.auth.success.register)
            }
        })
    };

    return <main className="flex md:flex-1 h-full flex-col px-5 py-10 pt-20 lg:p-20 lg:pt-28 h-smd:pt-20 lg:m-0 justify-center items-center">
        <Title text={dict.page.register.title}/>

        {/*Credentials login*/}
        <form>
            <motion.div
                initial={{x: "50%", opacity: 0}}
                animate={{x: 0, opacity: 1}}
                transition={{duration: 0.3, ease: "easeInOut"}}
                className="flex flex-col w-fit justify-center items-center"
            >
                <Input
                    label={dict.page.auth.input.name.label}
                    type="text"
                    id="name"
                    name="name"
                    onChange={(e: {
                        target: { value: React.SetStateAction<string> };
                    }) =>
                        setRegisterData({
                            ...registerData,
                            name: e.target.value.toString(),
                        })
                    }
                    required={true}
                    placeholder={dict.page.auth.input.name.placeholder}
                    register={register}
                    error={!!errors.name}
                    errorText={errors.name?.message?.toString()}
                    disabled={isPending}
                    value={registerData.name}
                />
                <Input
                    label={dict.page.auth.input.email.label}
                    type="text"
                    id="email"
                    name="email"
                    onChange={(e: {
                        target: { value: React.SetStateAction<string> };
                    }) =>
                        setRegisterData({
                            ...registerData,
                            email: e.target.value.toString(),
                        })
                    }
                    required={true}
                    placeholder={dict.page.auth.input.email.placeholder}
                    register={register}
                    error={!!errors.email}
                    errorText={errors.email?.message?.toString()}
                    disabled={isPending}
                    value={registerData.email}
                />
                <Input
                    label={dict.page.auth.input.password.label}
                    type="password"
                    id="password"
                    name="password"
                    onChange={(e: {
                        target: { value: React.SetStateAction<string> };
                    }) =>
                        setRegisterData({
                            ...registerData,
                            password: e.target.value.toString(),
                        })
                    }
                    required={true}
                    placeholder={dict.page.auth.input.password.placeholder}
                    register={register}
                    error={!!errors.password}
                    errorText={errors.password?.message?.toString()}
                    disabled={isPending}
                    value={registerData.password}
                />
                {error && <FormError text={error} error={true}/>}
                {success && <FormError text={success} error={false}/>}

                <div className="self-center w-full">
                    <Button text={dict.page.register.button.register} onClick={handleSubmit(registerHandler)}
                            className="w-full mt-5"/>
                </div>

                {/*<div className="flex flex-row w-full justify-center items-center py-5">*/}
                {/*    <div className="w-full h-0.5 rounded-full bg-gray"></div>*/}
                {/*    <p className="whitespace-nowrap px-4 text-gray">{dict.page.register.socialLogin.text}</p>*/}
                {/*    <div className="w-full h-0.5 rounded-full bg-gray"></div>*/}
                {/*</div>*/}

                {/*/!*Social Login*!/*/}
                {/*<div className="flex justify-center gap-5">*/}
                {/*    <SocialButton onClick={() => {*/}
                {/*    }} icon={faGoogle}/>*/}
                {/*    <SocialButton onClick={() => {*/}
                {/*    }} icon={faGithub}/>*/}
                {/*</div>*/}

                {/*Create account*/}
                <div className="flex flex-row justify-center mt-5">
                    <p className="mr-1">{dict.page.register.logIn.text}</p>
                    <LinkButton href="/login" target="_self" text={dict.page.register.logIn.link}/>
                </div>
            </motion.div>
        </form>
    </main>
}