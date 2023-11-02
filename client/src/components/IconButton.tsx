import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function IconButton(props: {
  icon: any;
  className?: string;
  onClick?: any;
  valueToChange?: any;
}) {
  return (
    <button
      type="button"
      className={
        `bg-primary hover:bg-primary-hover active:bg-primary-active text-light text-lg w-10 h-10 rounded-lg mt-5 self-center transition-colors ` +
        props.className
      }
      onClick={() => props.onClick(props.valueToChange)}
    >
      <FontAwesomeIcon icon={props.icon} />
    </button>
  );
}
