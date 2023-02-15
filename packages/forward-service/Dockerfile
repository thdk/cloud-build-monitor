FROM node:18-alpine as base
WORKDIR /app
COPY .yarn/ .yarn/
COPY package*.json .yarnrc.yml yarn.lock ./
COPY packages/forward-service/package.json packages/forward-service/package.json
WORKDIR /app/packages/forward-service
RUN yarn workspaces focus
COPY packages/forward-service/ ./

FROM node:18-alpine as test
WORKDIR /app
COPY --from=base /app ./
RUN yarn workspace forward-service run test

FROM node:18-alpine as dev
WORKDIR /app
COPY --from=base /app ./
RUN yarn workspace forward-service run build
CMD yarn workspace forward-service run dev

FROM node:18-alpine as build-and-clean
WORKDIR /app
COPY --from=base /app ./
RUN yarn workspace forward-service run build
RUN yarn workspaces focus --production forward-service
RUN rm -r .yarn

FROM node:18-alpine as runner
COPY --from=build-and-clean /app /app
WORKDIR /app/packages/forward-service
ENV PORT=8080
CMD node dist/index.js
