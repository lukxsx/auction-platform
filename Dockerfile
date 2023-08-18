FROM node:lts-alpine AS base

FROM base AS frontend-builder
WORKDIR /frontend
COPY ./frontend .
ENV REACT_APP_BACKEND_URL="http://localhost:3000/api"
ENV REACT_APP_SOCKET_IO_ADDR="http://localhost:3000"
RUN npm ci && npm run build

FROM base AS backend-builder
WORKDIR /backend
COPY . .
RUN npm ci && npm run tsc

FROM base AS prod
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY --from=backend-builder /backend/build ./build/
COPY --from=frontend-builder /frontend/build/ ./build/frontend
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["npm", "start"]
