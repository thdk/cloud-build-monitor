import Link from "next/link";

export function NavigationLink({
    href,
    label,
}: {
    href: string;
    label: string;
}) {
    return (
        (<Link href={href} className="px-8 py-4 underline">

            {label}

        </Link>)
    );
}
