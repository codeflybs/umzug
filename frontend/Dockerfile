FROM node:20-bullseye-slim AS build

WORKDIR /app

ARG REACT_APP_BACKEND_URL=http://localhost:8001
ENV REACT_APP_BACKEND_URL=${REACT_APP_BACKEND_URL}

# Install build dependencies required by CRA/Tailwind ecosystem
RUN apt-get update && \
    apt-get install -y --no-install-recommends python3 build-essential git ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Enable Yarn via Corepack (honours version from package.json)
RUN corepack enable

# Install dependencies (include devDependencies for build)
COPY package.json yarn.lock ./
RUN yarn install --non-interactive --production=false

# Copy source code and build
COPY public ./public
COPY src ./src
COPY craco.config.js tailwind.config.js postcss.config.js jsconfig.json ./ 
COPY components.json ./components.json

RUN yarn build

# Production image
FROM nginx:1.27-alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
