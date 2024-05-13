import Subheading from "@/components/Subheading.tsx";
import Link from "next/link";


export default function MeetHistoryItem ({ meetId, meetName, meetPlace }: { meetId: string, meetName: string, meetPlace: string }) {
    return (
        <li key={meetId}>
            <Link href={`/meet/` + meetId} className="flex flex-col w-[500px] mb-2 rounded-lg p-4 bg-light-hover hover:bg-light-primary active:bg-light-active transition-colors">
                <Subheading text={meetName} />

                {/* Meet place */}
                {meetPlace && <p><span>🏢 {meetPlace}</span></p>}
            </Link>
        </li>
    )
}