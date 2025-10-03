# ---- Base Stage ----
# Use a specific Node.js version for reproducibility
FROM node:18-alpine AS base
WORKDIR /usr/src/app
# Install dumb-init to handle signals properly
RUN apk add --no-cache dumb-init
# Install Prisma CLI globally in the base stage for access in subsequent stages
RUN npm install -g prisma

# ---- Dependencies Stage ----
# This stage is for installing npm dependencies to leverage Docker's layer caching.
FROM base AS dependencies
# Copy package.json and package-lock.json
COPY package.json package-lock.json ./
# Install production dependencies
RUN npm ci --only=production
# Copy development dependencies definition
COPY package.json package-lock.json ./
# Install all dependencies (including dev)
RUN npm ci

# ---- Build Stage ----
# This stage is for building the TypeScript source code.
FROM dependencies AS build
# Copy the entire source code
COPY . .
# Generate Prisma Client
RUN npx prisma generate
# Build the TypeScript project
RUN npm run build

# ---- Production Stage ----
# This is the final, optimized image for production.
FROM base AS production
# Set production environment
ENV NODE_ENV=production
# Copy production dependencies from the 'dependencies' stage
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
# Copy compiled code from the 'build' stage
COPY --from=build /usr/src/app/dist ./dist
# Copy Prisma schema and generated client for runtime
COPY --from=build /usr/src/app/prisma ./prisma
# Copy gRPC proto files needed at runtime
COPY --from=build /usr/src/app/proto ./proto
# Copy package.json to have access to project metadata if needed
COPY package.json .

# Use dumb-init to start the application. This ensures that SIGTERM signals
# are handled correctly by the Node.js process, allowing for graceful shutdowns.
CMD ["dumb-init", "node", "dist/main"]