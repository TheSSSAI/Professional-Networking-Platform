# Stage 1: Build stage
FROM node:18-alpine AS development

WORKDIR /usr/src/app

# Copy package files and install all dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Stage 2: Production stage
FROM node:18-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy build output from the development stage
COPY --from=development /usr/src/app/dist ./dist

# Copy Prisma schema and generated client from the development stage
COPY --from=development /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY prisma ./prisma

# Copy gRPC proto files
COPY --from=development /usr/src/app/proto ./proto


EXPOSE 50052

CMD ["node", "dist/main"]