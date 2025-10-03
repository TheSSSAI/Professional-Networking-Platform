# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and other necessary files
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Prune development dependencies
RUN npm prune --production


# Stage 2: Production
FROM node:20-alpine

# Set NODE_ENV to production
ENV NODE_ENV production

WORKDIR /usr/src/app

# Copy production dependencies and package files from builder
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Copy built application from builder
COPY --from=builder /usr/src/app/dist ./dist

# Copy Prisma schema and generated client for runtime
COPY --from=builder /usr/src/app/prisma ./prisma

# Expose the application port
EXPOSE 50052

# The gRPC health check probe
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD [ "node", "-e", "const client = require('@grpc/grpc-js'); const { promisify } = require('util'); const health = new (client.load('node_modules/@grpc/grpc-js/build/src/health-check-service.proto')).grpc.health.v1.Health(process.env.HEALTH_CHECK_URL || 'localhost:50052', client.credentials.createInsecure()); const check = promisify(health.check).bind(health); check({ service: '' }).then(r => { if (r.status !== 'SERVING') process.exit(1) }).catch(() => process.exit(1));" ]

# Start the application
CMD [ "node", "dist/main" ]