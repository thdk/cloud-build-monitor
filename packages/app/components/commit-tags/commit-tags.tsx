import classNames from "classnames";
import Link from "next/link";
import { useMemo } from "react";
import { useRepo } from "../../github/repo-context";
import { getTagsGroupedByCommitSha } from "../../github/tags";
import { useTags } from "../../github/use-tags";
import { Tag } from "../tag";

export function CommitTags({
    sha,
    className,
}: {
    sha: string;
    className?: string;
}) {
    const {
        owner,
        repo,
    } = useRepo();
    const tags = useTags();

    const tagDictionary = useMemo<Record<string, string[]>>(
        () => tags
            ? getTagsGroupedByCommitSha(tags)
            : {},
        [
            tags,
        ],
    );

    const styles = classNames(
        className,
        "flex space-x-2"
    );

    const commitTags = tagDictionary[sha];
    return commitTags
        ? (
            <div
                className={styles}
            >
                {commitTags.map((tag) => (
                    <Link
                        key={tag}
                        href={`/repos/${owner}/${repo}/commits/${tag}`}
                        passHref
                    >
                        <Tag
                            name={tag}
                        />
                    </Link>
                ))}
            </div>
        )
        : null;
}