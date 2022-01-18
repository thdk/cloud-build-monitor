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
        default:
            return <>❔</>;
    }
}