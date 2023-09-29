export const Button = (props: {
  text: string;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <button
      className={
        `bg-primary hover:bg-primary-hover active:bg-primary-active text-light font-medium w-fit px-4 py-2 rounded-lg mt-5 self-center transition-colors` +
        props.className
      }
      onClick={props.onClick}
    >
      {props.text}
    </button>
  );
};
