FROM node:16-alpine

ARG GITHUB_TOKEN=foobar

ENV GITHUB_TOKEN=$GITHUB_TOKEN
ENV CI=true
ENV NO_COLOR=true
ENV NODE_ENV=production

WORKDIR /workspace

COPY .yarn/ .yarn/
COPY package*.json .yarnrc.yml yarn.lock ./

COPY packages/app/package.json packages/app/package.json

RUN yarn workspaces focus app

WORKDIR /workspace/packages/app

COPY packages/app/ ./

RUN yarn build

CMD yarn start
