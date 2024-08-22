# Builder stage
FROM node:20 AS builder
WORKDIR /home/node/app

# Install Dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --no-cache

# Copy source code
COPY . .

# Build
RUN yarn build


# Runner stage
FROM node:20-alpine AS runner
WORKDIR /home/node/app
ENV NODE_ENV=production

# Install Production Dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --no-cache --production

# Copy build files
COPY --from=builder /home/node/app/build ./build

# Expose port and run
EXPOSE 8888
CMD yarn serve
