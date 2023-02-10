FROM node:18-alpine as base

WORKDIR /workspace

COPY .yarn/ .yarn/
COPY package*.json .yarnrc.yml yarn.lock ./

COPY packages/notification-service/package.json packages/notification-service/package.json

WORKDIR /workspace/packages/notification-service

RUN yarn workspaces focus

COPY packages/notification-service/ ./

FROM node:18-alpine as test

COPY --from=base /workspace /workspace

WORKDIR /workspace

RUN yarn workspace notification-service run test

FROM node:18-alpine as build-and-clean

COPY --from=base /workspace /workspace

WORKDIR /workspace

RUN yarn workspace notification-service build

RUN yarn workspaces focus --production notification-service
RUN rm -r .yarn

FROM node:18-alpine as runner
COPY --from=build-and-clean /workspace /workspace
WORKDIR /workspace/packages/notification-service

ENV PORT=8080

CMD node dist/index.js
