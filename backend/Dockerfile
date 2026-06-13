# ── Stage 1: deps ────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# ── Stage 2: runtime ─────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

# Copy production deps
COPY --from=deps /app/node_modules ./node_modules

# Copy source
COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
