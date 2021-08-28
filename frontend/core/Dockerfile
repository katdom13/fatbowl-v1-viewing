# syntax=docker/dockerfile:experimental
# Install dependencies only when needed
FROM node:14-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /usr/src/fatbowl/frontend
COPY package.json yarn.lock ./
RUN --mount=type=cache,id=yarn,sharing=locked,target=/usr/local/share/.cache/yarn yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:14-alpine AS builder
WORKDIR /usr/src/fatbowl/frontend
COPY . .
COPY --from=deps /usr/src/fatbowl/frontend/node_modules ./node_modules
RUN yarn build

# Production image, copy all the files and run next
FROM node:14-alpine AS runner
WORKDIR /usr/src/fatbowl/frontend

ARG APP_ENV=production
ARG NODE_ENV=production
ARG PORT=3000
ARG NEXT_PUBLIC_DOCKER=1

ENV APP_ENV=${APP_ENV} \
    NODE_ENV=${NODE_ENV} \
    PORT=${PORT} \
    NEXT_PUBLIC_DOCKER=${NEXT_PUBLIC_DOCKER} \
# This allows to access Graphql Playground
    APOLLO_PRODUCTION_INTROSPECTION=false

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

RUN mkdir -p /usr/src/fatbowl/frontend/.next/cache/images && chown nextjs:nodejs /usr/src/fatbowl/frontend/.next/cache/images
VOLUME /usr/src/fatbowl/frontend/.next/cache/images

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder /usr/src/fatbowl/frontend/next.config.js ./
COPY --from=builder /usr/src/fatbowl/frontend/public ./public
COPY --from=builder --chown=nextjs:nodejs /usr/src/fatbowl/frontend/.next ./.next
COPY --from=builder /usr/src/fatbowl/frontend/node_modules ./node_modules
COPY --from=builder /usr/src/fatbowl/frontend/package.json ./package.json

USER nextjs

EXPOSE ${PORT}

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
# ENV NEXT_TELEMETRY_DISABLED 1

CMD ["yarn", "start"]

# # Install dependencies only when needed
# FROM node:alpine AS deps
# # Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
# RUN apk add --no-cache libc6-compat
# WORKDIR /usr/src/fatbowl/frontend
# COPY package.json yarn.lock ./
# RUN yarn install --frozen-lockfile

# # Rebuild the source code only when needed
# FROM node:alpine AS builder
# WORKDIR /usr/src/fatbowl/frontend
# COPY . .
# COPY --from=deps /usr/src/fatbowl/frontend/node_modules ./node_modules
# RUN yarn build

# # Production image, copy all the files and run next
# FROM node:alpine AS runner
# WORKDIR /usr/src/fatbowl/frontend

# ENV NODE_ENV production
# ENV NEXT_PUBLIC_DOCKER 1

# RUN addgroup -g 1001 -S nodejs
# RUN adduser -S nextjs -u 1001

# # You only need to copy next.config.js if you are NOT using the default configuration
# COPY --from=builder /usr/src/fatbowl/frontend/next.config.js ./
# COPY --from=builder /usr/src/fatbowl/frontend/public ./public
# COPY --from=builder --chown=nextjs:nodejs /usr/src/fatbowl/frontend/.next ./.next
# COPY --from=builder /usr/src/fatbowl/frontend/node_modules ./node_modules
# COPY --from=builder /usr/src/fatbowl/frontend/package.json ./package.json

# USER nextjs

# EXPOSE 3000

# # Next.js collects completely anonymous telemetry data about general usage.
# # Learn more here: https://nextjs.org/telemetry
# # Uncomment the following line in case you want to disable telemetry.
# # ENV NEXT_TELEMETRY_DISABLED 1

# CMD ["yarn", "start"]