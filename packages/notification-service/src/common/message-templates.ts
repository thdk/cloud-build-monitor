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
/*
 * Template:
 *Shown.
 *{{#success}}
 *  Great job!
 *{{/success}}
 *{{#failure}}
 *  Fail!
 *{{/failure}}
 *
 *Hash:
 *{
 *  "success": true
 *}
 *
 *Output:
 *Shown.
 *  Great job!
 */

    const extra = {
        // allow to show some mustache template blocks only for failure / success
        success: data.status === "success",
        failure: data.status === "failure",
    }

    return Mustache.render(
        template,
        {
            ...data,
            ...extra,
        },
    );
}