import { PropsWithChildren } from "react";
import { Navigation } from "../navigation";

export function Layout({
    children,
}: PropsWithChildren<unknown>) {
    return (
        <div
            className="flex"
        >
            <div
                className="w-32"
            >
                <Navigation />
            </div>

            <div
                className="w-full flex pb-20 -ml-32 pl-32"
            >
                {children}
            </div>
        </div>
    );
}
