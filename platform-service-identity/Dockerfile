# Stage 1: Install dependencies
FROM node:18-alpine AS deps
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Stage 2: Build the application
FROM node:18-alpine AS builder
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
RUN npm install
RUN npm run proto:generate
RUN npx prisma generate
RUN npm run build

# Stage 3: Production image
FROM node:18-alpine AS final
WORKDIR /usr/src/app
ENV NODE_ENV production

# Copy production dependencies
COPY --from=deps /usr/src/app/node_modules ./node_modules
# Copy Prisma schema for runtime client
COPY --from=builder /usr/src/app/prisma/schema.prisma ./prisma/schema.prisma
# Copy compiled application code and proto definitions
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/proto ./proto

# Create a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 50051
CMD ["node", "dist/main"]