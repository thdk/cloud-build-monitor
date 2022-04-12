import { NavigationLink } from "./navigation-link";

export function Navigation() {
    return (
        <div
            className="flex flex-col pt-32 fixed"
        >
            <NavigationLink
                href="/"
                label="Home"
            />

            <NavigationLink
                href="/builds"
                label="Builds"
            />

            <NavigationLink
                href="/repos"
                label="Repos"
            />

            <NavigationLink
                href="/config/builds"
                label="Config"
            />
        </div>
    );
};
