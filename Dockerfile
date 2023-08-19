FROM node:lts-alpine AS base

# Install build dependencies
FROM base AS build-deps
WORKDIR /deps
COPY package*.json ./
COPY frontend/package*.json ./frontend/
RUN npm ci && npm run install-frontend

# Build frontend and backend
FROM base AS builder
ENV REACT_APP_BACKEND_URL="/api"
ENV REACT_APP_SOCKET_IO_ADDR="/"
WORKDIR /build
COPY --from=build-deps /deps/node_modules ./node_modules
COPY --from=build-deps /deps/frontend/node_modules ./frontend/node_modules
COPY . .
RUN npm run build-frontend && npm run tsc

# Install runtime dependencies and copy builds from the previous stage
FROM base AS prod
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY --from=builder /build/build ./build/
COPY --from=builder /build/frontend/build/ ./build/frontend
CMD ["npm", "start"]
