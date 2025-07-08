"use client"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface SocialButtonProps {
    onClick: () => void;
    className?: string;
    icon: any;
}

export const SocialButton = (props: SocialButtonProps) => {
    return (
        <button
            className={
                `bg-dark hover:bg-primary-hover active:bg-primary-active text-light font-medium w-fit px-3 py-3 rounded-lg flex self-center transition-colors ` +
                props.className
            }
            onClick={props.onClick}
        >
            <FontAwesomeIcon icon={props.icon} size="lg" />
        </button>
    );
}