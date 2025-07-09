# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.16.0

FROM node:${NODE_VERSION}-alpine

# process_env(NODE_ENV) now Use production node environment by default.
ENV NODE_ENV=production

WORKDIR /app

# Install PM2 globally
RUN npm install -g pm2

# Download dependencies as a separate step to take advantage of Docker's caching.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# Run the application as a non-root user.
# The USER node works because the node:alpine base image comes with a pre-created node user.
USER node

# copies all files from the build context (project root) into the current WORKDIR
COPY . .

# Expose the port that the application listens on.
EXPOSE 55555

# Run the application with PM2 using the ecosystem file
CMD ["pm2-runtime", "ecosystem.config.cjs"]
