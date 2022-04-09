import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import { ComponentType, ReactNode, useState } from "react";

export function Foldable({
    content,
    Header,
    open,
}: {
    content: ReactNode;
    Header: ComponentType<{open: boolean}>;
    open?: boolean;
}) {
    const [isOpen, setIsOpen] = useState(open || false);
    const styles = classNames([
        "pt-2 pr-8 mb-2 px-2 flex text-slate-700 items-center",
        "w-full border-solid border-gray-200 rounded-lg",
        {
            "border-b": !isOpen
        }
    ])
    return (
        <div>
            <div
                className={styles}
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen
                    ? <ChevronDownIcon className="h-5 w-5 mr-2" />
                    : <ChevronRightIcon className="h-5 w-5 mr-2" />
                }
                <Header open={isOpen} />
            </div>
            <div
                className="rounded-lg border w-full mb-4"
                style={{
                    display: isOpen ? "block" : "none"
                }}
            >
                {content}
            </div>
        </div>
    )
}