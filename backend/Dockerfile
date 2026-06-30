FROM node:20-alpine AS base
WORKDIR /app

# Dependencies stage
FROM base AS deps
COPY package*.json ./
RUN npm install --omit=dev

# Build stage
FROM base AS builder
COPY package*.json ./
RUN npm install
COPY . .

# Production stage
FROM base AS runner
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 ultris

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder --chown=ultris:nodejs /app/src ./src
COPY --from=builder --chown=ultris:nodejs /app/package.json ./package.json

USER ultris

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1))"

CMD ["node", "src/server.js"]
