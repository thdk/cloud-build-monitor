import { octokit } from "./octokit";

export const getRepos = async () => {
    // TODO: allow user to choose to list only private, public, owner, repos
    // and fetch all of them (not only the first page)
    const repos = await octokit.repos.listForAuthenticatedUser({
        type: "all",
        per_page: 100,
    });

    const repoRegex = new RegExp(process.env.NEXT_PUBLIC_REPO_REGEX || '.*');
    return repos.data
        .filter((repo) => repoRegex.test(repo.full_name));
};

export const getRepo = async ({
    repo,
    owner,
}: {
    repo: string;
    owner: string;
}) => {
    const gitRepo = await octokit.repos.get({
        repo,
        owner,
    });

    return gitRepo;
};
