# INSTALL

FROM node:18-alpine AS deps

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY .yarn/ .yarn/
COPY package*.json .yarnrc.yml yarn.lock ./

COPY packages/app/package.json packages/app/package.json

RUN yarn workspaces focus app

# BUILD

FROM node:18-alpine AS builder

ARG REPO_REGEX=.*
ARG ISSUE_REGEX
ARG GITHUB_TOKEN=foobar

WORKDIR /app
COPY --from=deps /app ./
COPY packages/app/ ./packages/app

ENV GITHUB_TOKEN=$GITHUB_TOKEN
ENV NEXT_PUBLIC_REPO_REGEX=$REPO_REGEX
ENV NEXT_PUBLIC_ISSUE_REGEX=$ISSUE_REGEX

ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn workspace app build

# DEV

FROM node:18-alpine AS dev
WORKDIR /app
COPY --from=builder /app ./
CMD yarn workspace app dev

# RUN

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/packages/app/next.config.js ./
COPY --from=builder /app/packages/app/public ./public
COPY --from=builder /app/packages/app/package.json ./package.json

COPY --from=builder --chown=nextjs:nodejs /app/packages/app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/packages/app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "./packages/app/server.js"]