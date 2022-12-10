FROM node:18-alpine as dependencies

WORKDIR /workspace

COPY .yarn/ .yarn/
COPY package*.json .yarnrc.yml yarn.lock ./

COPY packages/notification-service/package.json packages/notification-service/package.json

RUN yarn workspaces focus notification-service

WORKDIR /workspace/packages/notification-service

COPY packages/notification-service/ ./

RUN yarn build

CMD yarn start
