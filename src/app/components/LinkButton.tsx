import Link from "next/link";

type LinkButtonProps = {
    href: string;
    text: string;
    className?: string;
    target?: string;
};

export const LinkButton = ({
    href,
    text,
    className,
    target = "_blank",
}: LinkButtonProps) => {
  return (
    <Link
      href={href}
      target={target}
      className={`text-primary hover:text-primary-hover active:text-primary-active font-medium ${className}`}
    >
      {text}
    </Link>
  );
}
