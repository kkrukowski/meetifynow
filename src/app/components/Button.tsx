import GradientButton from "./ui/GradientButton";

export default function Button(props: {
  text: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}) {
  return (
    <GradientButton
      type={props.type ?? "button"}
      onClick={props.onClick}
      disabled={props.disabled}
      className={props.className}
    >
      {props.text}
    </GradientButton>
  );
}
