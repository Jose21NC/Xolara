# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json tsconfig.json ./
RUN npm install
COPY src/ ./src/
RUN npx tsc

# Production stage
FROM node:20-alpine
RUN apk add --no-cache dumb-init
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./

RUN mkdir -p /app/uploads

EXPOSE 4000
CMD ["dumb-init", "node", "dist/index.js"]
