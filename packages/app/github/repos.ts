import { octokit } from "./octocit";

export const getRepos = async () => {
    const repos = await octokit.repos.listForAuthenticatedUser({
        type: "all"
    });

    return repos.data
        .map((repo) => ({
            owner: repo.owner.login,
            name: repo.name,
        }));
}
