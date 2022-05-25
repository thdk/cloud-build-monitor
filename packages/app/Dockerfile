FROM node:16-alpine

WORKDIR /workspace

COPY .yarn/ .yarn/
COPY package*.json .yarnrc.yml yarn.lock ./

COPY packages/app/package.json packages/app/package.json

RUN yarn workspaces focus app

WORKDIR /workspace/packages/app

COPY packages/app/ ./

RUN yarn build

CMD yarn start
