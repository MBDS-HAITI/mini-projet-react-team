# ---- Dependencies ----
FROM node:22-alpine AS deps
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev


# ---- Runtime ----
FROM node:22-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0

# Crée (ou réutilise) le user non-root reactteam
# -S: system user/group
RUN addgroup -S reactteam && adduser -S reactteam -G reactteam

# Dépendances prod
COPY --from=deps /app/node_modules ./node_modules

# Code applicatif
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

# Permissions (au cas où certains dossiers doivent être lisibles)
RUN chown -R reactteam:reactteam /app

USER reactteam

EXPOSE 8010

# Healthcheck robuste (pas besoin de wget/curl)
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||8010)+'/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
