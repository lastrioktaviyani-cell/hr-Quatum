# Gunakan Node.js resmi sebagai base image
FROM node:18-alpine AS base

# 1. Install dependencies
FROM base AS deps
# Menambahkan openssl karena aplikasi Anda menggunakan Prisma + Supabase
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY package*.json ./
# Perbaikan: Menggunakan npm install biasa dengan flag legacy agar bypass konflik versi di server
RUN npm install --legacy-peer-deps

# 2. Rebuild the source code
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client sebelum build Next.js
RUN npx prisma generate
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# 3. Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["npm", "run", "start"]
