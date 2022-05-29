FROM node:16-alpine as dependencies

WORKDIR /workspace

COPY .yarn/ .yarn/
COPY package*.json .yarnrc.yml yarn.lock ./

COPY packages/ciccd-service/package.json packages/ciccd-service/package.json

RUN yarn workspaces focus ciccd-service

WORKDIR /workspace/packages/ciccd-service

COPY packages/ciccd-service/ ./

RUN yarn build

CMD yarn start
