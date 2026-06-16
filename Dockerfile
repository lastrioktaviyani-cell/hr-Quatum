# ---------- Base ----------
FROM node:22-alpine AS base

RUN apk add --no-cache libc6-compat git

# ---------- Dependencies ----------
FROM base AS deps
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm install

# ---------- Builder ----------
FROM base AS builder

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY . .

RUN npx prisma generate
RUN npm run build

# ---------- Runner ----------
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["npm", "start"]
