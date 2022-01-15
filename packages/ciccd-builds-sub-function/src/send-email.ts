import sgMail, { MailDataRequired } from '@sendgrid/mail';
import { config } from './config';


const sendEmail = async (emailData: MailDataRequired) => {
  sgMail.setApiKey(config.SENDGRID_API_KEY);

  return sgMail
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
};

export const sendBuildReportEmail = async ({
  branch,
  sha,
  status,
  issueNr,
  trigger,
  author,
}: {
  trigger: string,
  branch: string,
  sha: string,
  status: string,
  issueNr: string | null,
  author: string,
}) => {

  const templateId = config.SENDGRID_TEMPLATE_PREVIEW_BUILD_STATUS;

  const icon = status === "success"
    ? "✅"
    : "❌";

  await sendEmail({
    templateId,
    from: config.SENDGRID_SENDER,
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
};
