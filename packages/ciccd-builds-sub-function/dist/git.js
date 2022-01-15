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
exports.getCommitInfo = void 0;
const rest_1 = require("@octokit/rest");
const config_1 = require("./config");
const gitConfig = {
    owner: config_1.config.GITHUB_OWNER,
    repo: config_1.config.GITHUB_REPO,
    auth: config_1.config.GITHUB_TOKEN,
};
const getCommitInfo = (sha) => __awaiter(void 0, void 0, void 0, function* () {
    const octokit = new rest_1.Octokit(gitConfig);
    const commit = yield octokit.git.getCommit(Object.assign(Object.assign({}, gitConfig), { commit_sha: sha }));
    return commit.data;
});
exports.getCommitInfo = getCommitInfo;
