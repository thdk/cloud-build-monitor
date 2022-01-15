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
exports.generateReport = void 0;
const build_details_1 = require("./build-details");
const config_1 = require("./config");
const git_1 = require("./git");
const generateReport = ({ buildId, }) => __awaiter(void 0, void 0, void 0, function* () {
    const build = yield (0, build_details_1.getBuild)(buildId).catch(error => {
        console.error(error);
        return undefined;
    });
    if (!build) {
        console.error(`No build found for ${buildId}`);
        return;
    }
    if (!build.source.commitSha) {
        throw new Error("Can't get commit info without commit sha");
    }
    const commit = yield (0, git_1.getCommitInfo)(build.source.commitSha);
    const issue = commit.message.match(new RegExp(config_1.config.ISSUE_REGEX));
    return {
        build,
        commit,
        issue: issue ? issue[0] : null,
    };
});
exports.generateReport = generateReport;
