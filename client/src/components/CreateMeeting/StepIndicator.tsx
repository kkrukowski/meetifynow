export default function StepsIndicator(props: {isLast?: boolean, isCompleted?: boolean, isCurrent?: boolean}) {
    return (
        <li className="flex items-center">
            <div className={`p-2 h-10 w-10 rounded-lg ${props.isCompleted && "bg-primary"} ${props.isCurrent ? "border-2 border-primary bg-none": "bg-light-gray"} `}></div>
            {(!props.isLast && <div className={`w-20 h-2 rounded-lg mx-2  bg-light-gray ${props.isCompleted && "bg-primary"}`}></div>)}
        </li>
    )
}