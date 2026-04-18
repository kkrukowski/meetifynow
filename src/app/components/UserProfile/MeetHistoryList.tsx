import MeetHistoryItem from "@/components/UserProfile/MeetHistoryItem.tsx";
import Heading from "@/components/Heading.tsx";

export default function MeetHistoryList ({meetList, title}: { meetList: any[], title: string }) {
    return (
        <div>
            <Heading text={title} />
            <ul className="max-h-[350px] overflow-auto">
                {meetList.map((meet) => (
                    <MeetHistoryItem meetId={meet.appointmentId} meetName={meet.meetName} meetPlace={meet.meetPlace} />
                ))}
            </ul>

        </div>
    )
}