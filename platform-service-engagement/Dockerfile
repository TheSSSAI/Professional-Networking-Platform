# ---- Base Stage ----
FROM node:18-alpine AS base
WORKDIR /usr/src/app
RUN apk add --no-cache openssl

# ---- Dependencies Stage ----
FROM base AS dependencies
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN npm install --frozen-lockfile

# ---- Build Stage ----
FROM base AS build
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY . .
RUN npm run prisma:generate
RUN npm run build

# ---- Production Stage ----
FROM base AS production
ENV NODE_ENV production
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/prisma ./prisma
COPY --from=build /usr/src/app/proto ./proto

# It's important to run prisma generate again in the production image
# if the target architecture is different (e.g., building on Mac M1 for Linux amd64)
# This ensures the correct binary is available.
RUN npx prisma generate

EXPOSE 50053

# Run migrations and then start the application
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]