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
exports.ciccdBuildEvents = void 0;
const send_email_1 = require("./send-email");
const git_1 = require("./git");
const config_1 = require("./config");
const ciccdBuildEvents = ({ attributes, }) => __awaiter(void 0, void 0, void 0, function* () {
    const { origin, name, status, commitSha, branchName, repo, } = attributes || {};
    console.log({
        origin,
        name,
        status,
        commitSha,
        branchName,
        repo,
    });
    const commit = yield (0, git_1.getCommitInfo)(commitSha);
    const issue = commit.message.match(new RegExp(config_1.config.ISSUE_REGEX));
    yield (0, send_email_1.sendBuildReportEmail)({
        branch: branchName,
        author: commit.author.email,
        issueNr: issue ? issue[0] : null,
        sha: commitSha,
        status,
        trigger: name,
    });
});
exports.ciccdBuildEvents = ciccdBuildEvents;
