# ========= Base (Debian slim: ổn định cho Prisma) =========
FROM node:22-bookworm-slim AS base
WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl ca-certificates curl \
  && rm -rf /var/lib/apt/lists/*

# ========= Deps =========
FROM base AS deps
COPY package*.json ./
RUN npm ci --ignore-scripts

# ========= Builder =========
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Generate Prisma Client trước khi build Next
RUN npx prisma generate
RUN npm run build

# ========= Runner =========
FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app

# App runtime
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

# DB schema & migrations & env (SQLite trong container)
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.env ./.env

# Start script (fix CRLF trên Windows rồi chmod)
COPY docker/start.sh ./docker/start.sh
RUN sed -i 's/\r$//' ./docker/start.sh && chmod +x ./docker/start.sh

EXPOSE 3000
CMD ["./docker/start.sh"]
