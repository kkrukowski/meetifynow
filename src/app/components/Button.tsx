export default function Button(props: {
  text: string;
  className?: string;
  onClick?: any;
  disabled?: boolean;
}) {
  return (
    <button
      className={
        `bg-primary hover:bg-primary-hover active:bg-primary-active text-light w-fit px-4 py-2 rounded-lg self-center transition-colors ` +
        props.className
      }
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.text}
    </button>
  );
}
