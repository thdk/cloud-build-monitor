import { addBuildStatusInfo } from "./message-templates";

const buildStatusInfo: Parameters<typeof addBuildStatusInfo>[1] = {
    id: "id",
    branch: "feat/feat-1",
    commitAuthor: "Thomas Dekiere",
    logUrl: "https:example.com",
    repo: "thdk/cloud-build-monitor",
    sha: "029943addf5906502f338eade666930b7fc37677",
    status: "success",
    trigger: "build",
};
describe("addBuildStatusInfo", () => {
    it("add build status info into a template containing mustache tags", () => {
        const result = addBuildStatusInfo(
            `
                {{id}}-{{trigger}}-{{status}}

                {{sha}} @ {{{repo}}} / {{{branch}}}
            `,
            buildStatusInfo,
        );

        expect(result).toBe(
            `
                id-build-success

                029943addf5906502f338eade666930b7fc37677 @ thdk/cloud-build-monitor / feat/feat-1
            `
        );
    });

    it("does not show failed block for successful builds", () => {
        const result = addBuildStatusInfo(
            `
                {{id}}
                {{#failure}}Oh oh oh...{{/failure}}{{#success}}Hooray{{/success}}
            `,
            buildStatusInfo,
        );

        expect(result).toBe(
            `
                id
                Hooray
            `
        );
    });
});