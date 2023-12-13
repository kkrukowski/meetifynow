export default function StepsIndicator(props: {
  isLast?: boolean;
  isCompleted?: boolean;
  isCurrent?: boolean;
  index: number;
}) {
  return (
    <li className="flex items-center">
      <div
        className={`p-2 h-10 w-10 rounded-lg ${
          props.isCompleted && "bg-primary"
        } ${
          props.isCurrent ? "border-2 border-primary bg-none" : "bg-light-gray"
        } `}
      >
        <p
          className={`text-center font-bold ${
            props.isCurrent ? "text-primary" : "text-light"
          }`}
        >
          {props.index + 1}
        </p>
      </div>
      {!props.isLast && (
        <div
          className={`w-8 md:w-20 h-2 rounded-lg mx-2  bg-light-gray ${
            props.isCompleted && "bg-primary"
          }`}
        ></div>
      )}
    </li>
  );
}
