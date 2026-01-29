# Stage 1: Build the application
FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY src/ ./

# Stage 2: Create the final, minimal image
FROM node:24-alpine

WORKDIR /app

RUN addgroup -g 1001 -S nodejs \
    && adduser -S nodejs -u 1001 \
    && mkdir -p /cache \
    && chown -R nodejs:nodejs /cache

# Only copy the essential production files from the builder stage.
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/utils ./utils
COPY --from=builder --chown=nodejs:nodejs /app/routers ./routers
COPY --from=builder --chown=nodejs:nodejs /app/index.js ./

EXPOSE 3080

USER nodejs

CMD [ "node", "index.js" ]
