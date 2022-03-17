import { octokit } from "./octocit";

export const getRepos = async () => {
    const repos = await octokit.repos.listForAuthenticatedUser({
        type: "all"
    });

    return repos.data
        .filter((repo) => repo.owner.login === "smartphoto-group")
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
