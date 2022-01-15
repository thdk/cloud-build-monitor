"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBuild = void 0;
const cloudbuild_1 = require("@google-cloud/cloudbuild");
const config_1 = require("./config");
// Creates a client
const cb = new cloudbuild_1.CloudBuildClient();
const getBuild = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const [build] = yield cb
        .getBuild({
        id,
        projectId: config_1.config.GCP_PROJECT,
    })
        .catch(error => {
        console.error(`Failed to get build: ${id} in project ${config_1.config.GCP_PROJECT}`);
        throw error;
    });
    const [trigger] = (build.buildTriggerId &&
        (yield cb
            .getBuildTrigger({
            triggerId: build.buildTriggerId,
            projectId: config_1.config.GCP_PROJECT,
        })
            .catch(error => {
            console.error(`Failed to get build trigger: ${build.buildTriggerId} in project ${config_1.config.GCP_PROJECT}`);
            throw error;
        }))) ||
        [];
    // ---- Github push to branch substitutions ----
    // BRANCH_NAME: 'feat/email-notifications',
    // REF_NAME: 'feat/email-notifications',
    // TRIGGER_NAME: 'gcb-monitor',
    // TRIGGER_BUILD_CONFIG_PATH: 'cloudbuild.yaml',
    // REPO_NAME: 'cloud-build-monitor',
    // REVISION_ID: '8ddba877d8d80dbbd26b18ad464e0ee2a9c76775',
    // COMMIT_SHA: '8ddba877d8d80dbbd26b18ad464e0ee2a9c76775',
    // SHORT_SHA: '8ddba87'
    const { COMMIT_SHA: commitSha, BRANCH_NAME: branchName, REPO_NAME: repo, SHORT_SHA: commitShaShort, } = build.substitutions || {};
    return {
        source: {
            commitSha,
            branchName,
            repo,
            commitShaShort,
        },
        trigger,
        build,
    };
});
exports.getBuild = getBuild;
