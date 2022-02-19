import { octokit } from "./octocit";

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
                done();
            }
            return response.data;
        }
    );
}
