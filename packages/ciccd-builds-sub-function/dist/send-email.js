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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendBuildReportEmail = void 0;
const mail_1 = __importDefault(require("@sendgrid/mail"));
const config_1 = require("./config");
const sendEmail = (emailData) => __awaiter(void 0, void 0, void 0, function* () {
    mail_1.default.setApiKey(config_1.config.SENDGRID_API_KEY);
    return mail_1.default
        .send(emailData)
        .then(() => {
        console.log('Email sent');
    })
        .catch(error => {
        console.error("Failed to send email");
        console.log({
            emailData,
        });
        console.error(error);
    });
});
const sendBuildReportEmail = ({ branch, sha, status, issueNr, trigger, author, }) => __awaiter(void 0, void 0, void 0, function* () {
    const templateId = config_1.config.SENDGRID_TEMPLATE_PREVIEW_BUILD_STATUS;
    const icon = status === "success"
        ? "✅"
        : "❌";
    yield sendEmail({
        templateId,
        from: config_1.config.SENDGRID_SENDER,
        to: [author],
        dynamicTemplateData: {
            subject: `${icon} Build ${branch}: ${status.toLowerCase()} (${trigger})`,
            trigger,
            branch,
            sha,
            status,
            issueNr,
            commitAuthor: author,
        },
    });
});
exports.sendBuildReportEmail = sendBuildReportEmail;
