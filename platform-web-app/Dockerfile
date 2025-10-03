# Dockerfile for the Next.js Platform Web App
# This uses a multi-stage build to create a lean, optimized production image.
# Aligns with REQ-1-076.

# ---- Base Stage ----
# Use a specific Node.js version for reproducibility
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm config set fetch-retry-maxtimeout 600000 -g && npm i -g pnpm

# ---- Dependencies Stage ----
# Install production dependencies
FROM base AS deps
RUN pnpm install --prod

# ---- Build Stage ----
# Build the Next.js application
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# ---- Production Stage ----
# Create the final, lean image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy production dependencies
COPY --from=deps /app/node_modules ./node_modules
# Copy built application
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.mjs ./next.config.mjs

# Expose the port Next.js runs on
EXPOSE 3000

# Add a non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

# Start the application
CMD ["pnpm", "start"]