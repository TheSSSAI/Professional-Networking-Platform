# Stage 1: Build the application
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /usr/src/app

# Copy project files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Prune development dependencies
RUN npm prune --production

# Stage 2: Create the production image
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy node_modules from builder
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Copy build output from builder
COPY --from=builder /usr/src/app/dist ./dist

# Copy Prisma schema
COPY --from=builder /usr/src/app/prisma ./prisma

# Expose the application port
EXPOSE 5001

# Healthcheck to ensure the service is running
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD [ "node", "-e", "const net = require('net'); const client = new net.Socket(); client.connect(5001, 'localhost', () => client.destroy()); client.on('error', (err) => process.exit(1));" ]

# Define the command to run the application
# This command first applies any pending database migrations and then starts the service.
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]