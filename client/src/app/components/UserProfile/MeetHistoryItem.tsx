import Subheading from "@/components/Subheading.tsx";
import Link from "next/link";


export default function MeetHistoryItem () {
    return (
        <Link href="/" className="flex flex-col w-[500px] mb-2 rounded-lg p-4 bg-light-hover hover:bg-light-primary active:bg-light-active transition-colors">
            <Subheading text={"Nazwa spotkania #1"} />

            {/* Meet place */}
            <p><span>🏢 </span>{"Miejsce spotkania"}</p>
        </Link>
    )
}