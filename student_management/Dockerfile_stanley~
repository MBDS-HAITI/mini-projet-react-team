# ---- Dependencies ----
FROM node:20-alpine AS deps
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

# ---- Runtime ----
FROM node:20-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0

# Sécurité: user non-root
RUN addgroup -S app && adduser -S app -G app

# Dépendances
COPY --from=deps /app/node_modules ./node_modules

# Code applicatif (racine du projet)
COPY package*.json ./
COPY auths ./auths
COPY config ./config
COPY controllers ./controllers
COPY data ./data
COPY middlewares ./middlewares
COPY models ./models
COPY routes ./routes
COPY scripts ./scripts
COPY server.js ./server.js

USER app

EXPOSE 8010

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:${PORT:-8010}/health || exit 1

CMD ["node", "server.js"]
