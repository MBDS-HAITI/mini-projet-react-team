#DEPENDANCE STAGE
FROM node:24-bookworm-slim as deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

#RUNTIME STAGE / FINAL IMAGE
FROM node:24-bookworm-slim as runtime
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY auths ./auths
COPY config ./config/
COPY controllers ./controllers
COPY data ./data
COPY middlewares ./middlewares
COPY models ./models
COPY routes ./routes
COPY scripts ./scripts

RUN 

CMD ["node", "server.js"]
