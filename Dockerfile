# BAGGI storefront + API in one container.
# Build from the project folder:  docker build -t BAGGI-store .
FROM node:20-alpine

WORKDIR /app

# Install API dependencies first (better layer caching)
COPY server/package.json server/package-lock.json ./server/
RUN cd server && npm ci --omit=dev

# Storefront files + server code. The API serves the static site from ../.
COPY . .

ENV PORT=3000
ENV NODE_ENV=production
EXPOSE 3000

# Persistent storage note: server/data/orders.json lives inside the container.
# Mount a volume at /app/server/data (or use a database) so orders survive deploys.
VOLUME ["/app/server/data"]

CMD ["node", "server/index.js"]
