import { octokit } from "./octocit";

export const getRepos = async () => {
    const repos = await octokit.repos.listForAuthenticatedUser({
        type: "all"
    });

    const repoRegex = new RegExp(process.env.NEXT_PUBLIC_REPO_REGEX || '.*');
    return repos.data
        .filter((repo) => repoRegex.test(repo.full_name))
        .map((repo) => ({
            owner: repo.owner.login,
            name: repo.name,
        }));
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
