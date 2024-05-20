'use client';

import { Locale } from "@root/i18n.config";
import Title from "@/components/Title.tsx";
import React from "react";

// Shadcn components
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


import { useChat } from 'ai/react';
import ChatInput from "@/components/AI/ChatInput.tsx";

export default function ChatBotPage({ lang }: { lang: Locale }) {
    const { messages, input, handleInputChange, handleSubmit, data } = useChat({api: 'http://localhost:3000/api/chat'});

    function processBoldText(promptText) {
        const boldRegex = /\*\*(.*?)\*\*/g;
        const processedText = promptText.replace(boldRegex, '<strong>$1</strong>');
        return processedText;
    }

    return <main className="flex md:flex-1 h-full flex-col px-5 py-10 pt-20 lg:p-20 lg:pt-28 h-smd:pt-20 lg:m-0">
        <Title text={"MeetifyNow - Asystent AI"}/>
        <div className="flex flex-1 flex-col justify-between w-[700px] h-full p-5 rounded-lg border-2 border-dark">
            <ScrollArea className="flex flex-col-reverse h-full max-h-[550px] rounded-lg w-full overflow-y-auto">
                {messages.map(m => (
                    <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'pr-24'} first:mt-0 mt-5 w-full whitespace-pre-wrap`}>
                        {m.role !== 'user' &&
                                <Avatar className="mr-5">
                                <AvatarImage src="" />
                                <AvatarFallback className="bg-light-gray font-bold">AI</AvatarFallback>
                            </Avatar>
                            }
                            <div className={`px-3 py-2 ${m.role !== 'user' ? 'bg-light-gray text-dark font-medium' : 'bg-primary text-white'} rounded-lg`}>
                                <p dangerouslySetInnerHTML={{__html: processBoldText(m.content)}}></p>
                            </div>
                    </div>
                ))}
            </ScrollArea>


            <form onSubmit={handleSubmit} className="mt-5">
                <ChatInput type="text" id="input" name="input" value={input} placeholder={"Zadaj pytanie botowi"} onChange={handleInputChange} />
            </form>
        </div>
    </main>
}