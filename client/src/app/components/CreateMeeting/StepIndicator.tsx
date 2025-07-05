export default function StepsIndicator(props: {
  isLast?: boolean;
  isCompleted?: boolean;
  isCurrent?: boolean;
  index: number;
  shouldAnimateLine?: boolean;
}) {
  return (
    <li className="flex items-center">
      <div
        className={`p-2 h-10 w-10 rounded-lg transition-all duration-500 ease-in-out ${
          props.isCompleted && "bg-primary"
        } ${
          props.isCurrent ? "border-2 border-primary bg-none" : "bg-light-gray"
        } `}
      >
        <p
          className={`text-center font-bold transition-colors duration-500 ease-in-out ${
            props.isCurrent ? "text-primary" : "text-light"
          }`}
        >
          {props.index + 1}
        </p>
      </div>
      {!props.isLast && (
        <div className="relative w-8 md:w-20 h-2 rounded-lg mx-2">
          {/* Tło linii */}
          <div className="absolute inset-0 bg-light-gray rounded-lg"></div>
          {/* Zapełniona część linii */}
          <div
            className={`absolute inset-0 bg-primary rounded-lg transition-all duration-500 ease-in-out ${
              props.isCompleted
                ? "w-full"
                : props.shouldAnimateLine
                ? "w-full"
                : "w-0"
            }`}
          ></div>
        </div>
      )}
    </li>
  );
}
