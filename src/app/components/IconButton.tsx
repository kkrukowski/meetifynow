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
            ? "border-2 border-primary bg-primary/10 text-primary shadow-sm hover:shadow-md"
            : "bg-primary text-white shadow-sm hover:shadow-md shadow-primary/20"
        } hover:bg-primary-hover active:bg-primary-active text-lg w-12 h-12 rounded-[14px] mt-5 self-center transition-all duration-300 ease-out flex items-center justify-center ` +
        props.className
      }
      onClick={() => !props.isCurrent && props.onClick(props.valueToChange)}
    >
      <FontAwesomeIcon icon={props.icon} />
    </button>
  );
}
