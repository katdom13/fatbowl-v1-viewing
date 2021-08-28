# Install dependencies only when needed
FROM node:alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /usr/src/fatbowl/frontend
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:alpine AS builder
WORKDIR /usr/src/fatbowl/frontend
COPY . .
COPY --from=deps /usr/src/fatbowl/frontend/node_modules ./node_modules
RUN yarn build && yarn install --production --ignore-scripts --prefer-offline

# Production image, copy all the files and run next
FROM node:alpine AS runner
WORKDIR /usr/src/fatbowl/frontend

ENV NODE_ENV production
ENV FROM_DOCKER 1

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder /usr/src/fatbowl/frontend/next.config.js ./
COPY --from=builder /usr/src/fatbowl/frontend/public ./public
COPY --from=builder --chown=nextjs:nodejs /usr/src/fatbowl/frontend/.next ./.next
COPY --from=builder /usr/src/fatbowl/frontend/node_modules ./node_modules
COPY --from=builder /usr/src/fatbowl/frontend/package.json ./package.json

USER nextjs

EXPOSE 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
# ENV NEXT_TELEMETRY_DISABLED 1

CMD ["yarn", "start"]