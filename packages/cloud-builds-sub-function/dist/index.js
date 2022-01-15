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
exports.cloudBuildEvents = void 0;
const pubsub_1 = require("@google-cloud/pubsub");
const build_details_1 = require("./build-details");
const pubSubClient = new pubsub_1.PubSub();
const cloudBuildEvents = ({ attributes, }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { buildId, status } = attributes || {};
    if (!buildId) {
        return;
    }
    if (!status) {
        return;
    }
    const build = yield (0, build_details_1.getBuild)(buildId);
    pubSubClient.topic("ciccd-builds").publishMessage({
        attributes: {
            origin: "cloud-build",
            name: ((_a = build.trigger) === null || _a === void 0 ? void 0 : _a.name) || "n/a",
            status: status.toLowerCase(),
            commitSha: build.source.commitSha,
            repo: build.source.repo,
        },
    });
});
exports.cloudBuildEvents = cloudBuildEvents;
