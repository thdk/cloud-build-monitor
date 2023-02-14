FROM node:18-alpine as base
WORKDIR /app
COPY .yarn/ .yarn/
COPY package*.json .yarnrc.yml yarn.lock ./
COPY packages/notification-service/package.json packages/notification-service/package.json
WORKDIR /app/packages/notification-service
RUN yarn workspaces focus
COPY packages/notification-service/ ./

FROM node:18-alpine as test
WORKDIR /app
COPY --from=base /app ./
RUN yarn workspace notification-service run test

FROM node:18-alpine as dev
WORKDIR /app
COPY --from=base /app ./
RUN yarn workspace notification-service run build
CMD yarn workspace notification-service run dev

FROM node:18-alpine as build-and-clean
WORKDIR /app
COPY --from=base /app ./
RUN yarn workspace notification-service run build
RUN yarn workspaces focus --production notification-service
RUN rm -r .yarn

FROM node:18-alpine as runner
COPY --from=build-and-clean /app /app
WORKDIR /app/packages/notification-service
ENV PORT=8080
CMD node dist/index.js
