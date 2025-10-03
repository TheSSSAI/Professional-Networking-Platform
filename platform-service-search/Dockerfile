# Stage 1: Development - for local development with hot-reloading
FROM node:20-alpine AS development
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "run", "start:dev"]

# Stage 2: Builder - creates a lean production build
FROM node:20-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
# Use npm ci for reproducible builds
RUN npm ci --only=production
COPY . .
# Build the application, excluding test files
RUN npm run build
# Prune development dependencies
RUN npm prune --production

# Stage 3: Production - final, lean image for deployment
FROM node:20-alpine AS production
# grpc_health_probe for Kubernetes health checks
RUN apk add --no-cache curl
RUN GRPC_HEALTH_PROBE_VERSION=v0.4.24 && \
    wget -q -O /usr/bin/grpc_health_probe https://github.com/grpc-ecosystem/grpc-health-probe/releases/download/${GRPC_HEALTH_PROBE_VERSION}/grpc_health_probe-linux-amd64 && \
    chmod +x /usr/bin/grpc_health_probe

WORKDIR /usr/src/app
# Copy only necessary files from the builder stage
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package.json ./package.json
# Copy proto files needed at runtime
COPY --from=builder /usr/src/app/src/modules/search/protos ./dist/modules/search/protos

# The service will listen on a gRPC port
EXPOSE 50053

USER node

CMD ["node", "dist/main"]