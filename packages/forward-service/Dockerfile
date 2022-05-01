FROM node:16-alpine as dependencies

WORKDIR /workspace

COPY .yarn/ .yarn/
COPY package*.json .yarnrc.yml ./

COPY packages/forward-service/package.json packages/forward-service/package.json

RUN yarn workspaces focus forward-service

WORKDIR /workspace/packages/forward-service

COPY packages/forward-service/ ./

RUN yarn build

CMD yarn start
