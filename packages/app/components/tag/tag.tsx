export function Tag({
    name,
    href,
}: {
    name: string;
    href?: string;
}) {
    return (
        <a
            href={href}
            className="px-2"
        >
            🏷 <span className="underline">{name}</span>
        </a>
    )
}