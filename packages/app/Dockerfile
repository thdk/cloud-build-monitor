FROM node:16-alpine

ARG REPO_REGEX=.*
ARG ISSUE_REGEX

ENV CI=true
ENV NO_COLOR=true

ENV NODE_ENV=production

ENV NEXT_PUBLIC_REPO_REGEX=$REPO_REGEX
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
