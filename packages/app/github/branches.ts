import { createOctokit } from "./octokit";

export async function getAllBranches({
    owner,
    repo,
}: {
    owner?: string;
    repo?: string;
}) {

    if (!owner || !repo) {
        return [];
    }

    let count = 0
    const octokit = createOctokit();
    return octokit.paginate(
        octokit.repos.listBranches,
        {
            owner,
            repo,
            per_page: 100,
        },
        (response, done) => {
            count += response.data.length
            if (count >= 1000) {
                console.warn(`${repo} has more than 1000 branches. Returning only 1000 branches.`)
                done();
            }
            return response.data;
        }
    );
}
