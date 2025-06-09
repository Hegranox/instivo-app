# Use Node.js LTS as base image
FROM node:20-slim AS base

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

# Build the app
# ✅ Exibe o valor da env e embute ela no build
RUN echo "🔧 VITE_API_BASE_URL=$VITE_API_BASE_URL" \
  && VITE_API_BASE_URL=$VITE_API_BASE_URL pnpm build

# Production stage
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=base /app/dist /usr/share/nginx/html

# Copy nginx config if you have custom configuration
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
