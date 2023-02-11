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
      {
        issueRegex,
      }: {
        issueRegex?: string;
      } = {}
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
        issueId: () => (text: string, render: (template: string) => string) => {
            if (!issueRegex) {
                return render(text);
            }

            const regex = new RegExp(issueRegex);

            return regex.exec(render(text));
        },
        lowercase: () => (text: string, render: (template: string) => string) => {
            return render(text).toLowerCase();
        }
    }

    return Mustache.render(
        template,
        {
            ...data,
            ...extra,
        },
    );
}