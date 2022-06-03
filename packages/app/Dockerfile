FROM node:16-alpine

ARG GITHUB_TOKEN=foobar
ARG REPO_REGEX=.*
ARG JIRA_HOST
ARG JIRA_PASSWORD
ARG JIRA_USER
ARG ISSUE_REGEX

ENV GITHUB_TOKEN=$GITHUB_TOKEN
ENV NEXT_PUBLIC_GITHUB_TOKEN=$GITHUB_TOKEN
ENV NEXT_PUBLIC_REPO_REGEX=$REPO_REGEX
ENV CI=true
ENV NO_COLOR=true
ENV NODE_ENV=production
ENV JIRA_HOST=$JIRA_HOST
ENV JIRA_PASSWORD=$JIRA_PASSWORD
ENV JIRA_USER=$JIRA_USER
ENV NEXT_PUBLIC_ISSUE_REGEX=$ISSUE_REGEX

WORKDIR /workspace

COPY .yarn/ .yarn/
COPY package*.json .yarnrc.yml yarn.lock ./

COPY packages/app/package.json packages/app/package.json

RUN yarn workspaces focus app

WORKDIR /workspace/packages/app

COPY packages/app/ ./

RUN yarn build

CMD yarn start
