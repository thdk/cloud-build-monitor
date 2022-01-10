import sgMail, {MailDataRequired} from '@sendgrid/mail';
import {getBuild} from './build-details';
import {config} from './config';
import {getCommitInfo} from './git';


const sendEmail = async (emailData: MailDataRequired) => {
  sgMail.setApiKey(config.SENDGRID_API_KEY);

  return sgMail
    .send(emailData)
    .then(() => {
      console.log('Email sent');
    })
    .catch(error => {
      console.error(error);
    });
};

export const sendBuildReportEmail = async ({
  build,
  commit,
  status,
  issue,
}: {
  build: Awaited<ReturnType<typeof getBuild>>;
  commit: Awaited<ReturnType<typeof getCommitInfo>>;
  status: string;
  issue: string | null;
}) => {
  if (!build) {
    return;
  }

  const templateId = config.SENDGRID_TEMPLATE_PREVIEW_BUILD_STATUS;

  await sendEmail({
    from: config.SENDGRID_SENDER,
    templateId,
    personalizations: [
      {
        to: [
          {
            // temporary
            email: 't.dekiere@gmail.com',
          },
          {
            email: commit.author.email,
          },
        ],
        subject: `Build ${status}: ${build.source.branchName} (${build.trigger?.name})`,
        dynamicTemplateData: {
          trigger: build.trigger?.name,
          branch: build.source.branchName,
          sha: build.source.commitSha,
          status: status.toLowerCase(),
          issueNr: issue,
          commitAuthor: commit.author.name,
        },
      },
    ],
  });
};
