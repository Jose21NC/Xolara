# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml .npmrc ./
COPY src/ ./src/
COPY public/ ./public/
COPY index.html vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json ./
RUN npm install -g pnpm && pnpm install
RUN pnpm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
