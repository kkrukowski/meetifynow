export default function UserInfoField ({fieldName, fieldValue}: { fieldName: string, fieldValue: string }) {
    return (
        <div className="mb-2">
            <p className="text-sm font-medium text-gray">{fieldName}</p>
            <p className="text-dark font-bold font-medium">{fieldValue}</p>
        </div>
    )
}