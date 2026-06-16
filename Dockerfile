# Gunakan node standar versi slim yang lebih stabil dibanding alpine untuk urusan npm install
FROM node:18-slim AS builder
WORKDIR /app

# Install openssl untuk keperluan database Supabase
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

# Gunakan--no-audit dan --prefer-offline agar proses build sangat ringan di RAM VPS
RUN npm install --no-audit --prefer-offline --no-fund

COPY . .

# Generate Client & Build
RUN npx prisma generate
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Runner Stage (Hanya mengambil hasil jadi agar sizenya kecil)
FROM node:18-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["npm", "run", "start"]
