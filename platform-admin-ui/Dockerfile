# syntax=docker/dockerfile:1

# ---- Base Stage ----
# Use a specific Node.js version for reproducibility.
# The 'alpine' variant is lightweight.
FROM node:20-alpine AS base
WORKDIR /app
# Install dependencies required for building native modules, if any.
# libc6-compat is needed for some Node.js functionalities on Alpine.
RUN apk add --no-cache libc6-compat


# ---- Dependencies Stage ----
# This stage is for installing dependencies only. It will be cached by Docker
# as long as package.json and lock files don't change.
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
# Install production dependencies.
RUN npm ci --only=production


# ---- Builder Stage ----
# This stage is for building the Next.js application.
FROM base AS builder
WORKDIR /app
# Copy dependencies from the 'deps' stage.
COPY --from=deps /app/node_modules ./node_modules
# Copy all project files.
COPY . .
# Install all dependencies including devDependencies to run the build script.
RUN npm install
# Build the Next.js application.
# The NEXT_PUBLIC_GRAPHQL_API_URL can be passed as a build argument
# if it needs to be baked into the static assets.
ARG NEXT_PUBLIC_GRAPHQL_API_URL
ENV NEXT_PUBLIC_GRAPHQL_API_URL=${NEXT_PUBLIC_GRAPHQL_API_URL}
RUN npm run build


# ---- Runner Stage (Production) ----
# This is the final, lightweight production image.
FROM base AS runner
WORKDIR /app

# Create a non-root user for security.
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Copy dependency files.
COPY --from=deps /app/node_modules ./node_modules

# Copy the built application from the 'builder' stage.
# The `standalone` output mode in next.config.mjs creates this minimal build.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Expose the port Next.js runs on.
EXPOSE 3000

# The command to run the application.
CMD ["node", "server.js"]