FROM node:lts-alpine AS base

# Frontend build dependencies
FROM base AS frontend-deps
WORKDIR /deps
COPY ./frontend/package*.json ./
RUN npm ci

# Backend build dependencies
FROM base AS backend-deps
WORKDIR /deps
COPY ./backend/package*.json ./
RUN npm ci

# Build frontend
FROM base AS frontend-builder
ENV VITE_APP_BACKEND_URL="/api"
ENV VITE_APP_SOCKET_IO_ADDR="/"
WORKDIR /build
COPY --from=frontend-deps /deps/node_modules ./node_modules
COPY ./frontend/ .
RUN npm run build

# Build backend
FROM base AS backend-builder
WORKDIR /build
COPY --from=backend-deps /deps/node_modules ./node_modules
COPY ./backend/ .
RUN npm run build

# Install runtime dependencies and copy builds from the previous stage
FROM base AS prod
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
WORKDIR /app
COPY backend/package*.json ./
RUN npm install --omit=dev && mkdir uploads
COPY --from=backend-builder ./build/build ./build/
COPY --from=frontend-builder ./build/dist ./build/frontend
CMD ["npm", "start"]
