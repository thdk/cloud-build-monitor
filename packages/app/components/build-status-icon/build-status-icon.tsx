export function BuildStatusIcon({
    status,
}: {
    status: string;
}) {

    switch (status) {
        case "success":
            return <div>✅</div>;
        case "failure":
            return <div>❌</div>;
        case "queued":
            return <div>🔜</div>;
        case "working":
            return <div>⚙️</div>;
        case "cancelled":
            return <div>🛑</div>;
        case "timeout":
            return <div>⏰</div>;
        default:
            return <div>❔</div>;
    }
}