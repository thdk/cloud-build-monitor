export function BuildStatusIcon({
    status,
}: {
    status: string;
}) {

    switch (status) {
        case "success":
            return <>✅</>;
        case "failure":
            return <>❌</>;
        case "queued":
            return <>🔜</>;
        case "working":
            return <>⚙️</>;
        case "cancelled":
            return <>🛑</>;
        default:
            return <>❔</>;
    }
}