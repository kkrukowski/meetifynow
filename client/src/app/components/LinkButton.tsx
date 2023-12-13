export default function LinkButton(props: {
  href: string;
  text: string;
  className?: string;
}) {
  return (
    <a
      href={props.href}
      target="_blank"
      className={`text-primary hover:text-primary-hover active:text-primary-active font-medium ${props.className}`}
    >
      {props.text}
    </a>
  );
}
