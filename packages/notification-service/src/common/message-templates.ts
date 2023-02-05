import Mustache from "mustache";

export const addBuildStatusInfo = (
    template: string,
    data: {
        id: string;
        trigger: string;
        sha: string;
        branch: string | null;
        status: string;
        logUrl: string | null;
        repo: string,
        commitAuthor: string | null;
      },
) => {
    return Mustache.render(
        template,
        data,
    );
}