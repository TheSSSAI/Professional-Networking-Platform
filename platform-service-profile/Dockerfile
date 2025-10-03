# Stage 1: Development - Install all dependencies
FROM node:18-alpine AS development
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run prisma:generate

# Stage 2: Builder - Build the application
FROM node:18-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
COPY --from=development /usr/src/app/node_modules ./node_modules
COPY . .
RUN npm run build
RUN npm prune --production

# Stage 3: Production - Create a minimal image for running the app
FROM node:18-alpine AS production
ENV NODE_ENV production
WORKDIR /usr/src/app

COPY package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/proto ./proto
COPY --from=builder /usr/src/app/prisma ./prisma

# Create a non-root user and switch to it for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 50051

CMD ["node", "dist/main"]