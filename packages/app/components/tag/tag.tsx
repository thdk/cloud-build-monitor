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
            className="flex text-slate-500"
        >
            🏷 <span className="underline">{name}</span>
        </a>
    )
}