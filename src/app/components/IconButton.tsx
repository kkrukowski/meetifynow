import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function IconButton(props: {
  icon: any;
  className?: string;
  onClick?: any;
  valueToChange?: any;
  isCurrent?: boolean;
}) {
  return (
    <button
      type="button"
      className={
        `${
          props.isCurrent
            ? "border-2 border-primary text-primary bg-none hover:text-light hover:border-transparent"
            : "bg-primary text-light"
        } hover:bg-primary-hover active:bg-primary-active text-lg w-10 h-10 rounded-lg mt-5 self-center transition-colors ` +
        props.className
      }
      onClick={() => !props.isCurrent && props.onClick(props.valueToChange)}
    >
      <FontAwesomeIcon icon={props.icon} />
    </button>
  );
}
