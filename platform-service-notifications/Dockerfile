# Stage 1: Build Dependencies
# This stage installs all dependencies, including devDependencies, to be used in the build stage.
FROM node:20.11.0-alpine AS deps
WORKDIR /usr/src/app
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN npm install

# Stage 2: Build Application
# This stage builds the TypeScript source code into JavaScript.
FROM node:20.11.0-alpine AS builder
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
# Generate Prisma Client - it is needed for the build step if types are used
RUN npx prisma generate
# Build the application
RUN npm run build

# Stage 3: Production Image
# This is the final, lean production image.
FROM node:20.11.0-alpine AS production
# Set Node environment to production
ENV NODE_ENV production
WORKDIR /usr/src/app

# Copy production dependencies from the 'deps' stage
COPY --from=deps /usr/src/app/node_modules ./node_modules
# Copy built application from the 'builder' stage
COPY --from=builder /usr/src/app/dist ./dist
# Copy Prisma schema and migrations for production deployment
COPY --from=builder /usr/src/app/prisma ./prisma

# Create a non-root user and switch to it
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Expose the application port
EXPOSE 3004

# The command to run the application.
# It first applies any pending database migrations and then starts the Node.js server.
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]