FROM node:18-alpine as base
WORKDIR /app
COPY .yarn/ .yarn/
COPY package*.json .yarnrc.yml yarn.lock ./
COPY packages/ciccd-service/package.json packages/ciccd-service/package.json
WORKDIR /app/packages/ciccd-service
RUN yarn workspaces focus
COPY packages/ciccd-service/ ./

FROM node:18-alpine as test
WORKDIR /app
COPY --from=base /app ./
RUN yarn workspace ciccd-service run test

FROM node:18-alpine as build-and-clean
WORKDIR /app
COPY --from=base /app ./
RUN yarn workspace ciccd-service run build
RUN yarn workspaces focus --production ciccd-service
RUN rm -r .yarn

FROM node:18-alpine as runner
COPY --from=build-and-clean /app /app
WORKDIR /app/packages/ciccd-service
ENV PORT=8080
CMD node dist/index.js
