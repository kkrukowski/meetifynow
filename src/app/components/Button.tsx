export default function Button(props: {
  text: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}) {
  return (
    <button
      type={props.type ?? "button"}
      className={
        `bg-primary hover:bg-primary-hover active:bg-primary-active text-light w-fit px-4 py-2 rounded-lg self-center transition-colors ` +
        `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ` +
        `disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary ` +
        (props.className ?? "")
      }
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.text}
    </button>
  );
}
