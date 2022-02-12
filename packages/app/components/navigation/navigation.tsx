import { NavigationLink } from "./navigation-link";

export function Navigation() {
    return (
        <div
            className="flex flex-col pt-32 fixed"
        >
                <NavigationLink
                    href="/builds"
                    label="Builds"
                />

                <NavigationLink
                    href="/repos"
                    label="Repos"
                />
        </div>
    );
};
