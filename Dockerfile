# Multi-stage build for React Vite application

# Stage 1: Build the application
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY araistotle/package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY araistotle/ ./

# Build the application
RUN NODE_OPTIONS="--max-old-space-size=8192" npm run build

# Stage 2: Serve the application
FROM nginx:alpine

# Copy the built application from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Set default PORT environment variable
ENV PORT=8080

# Expose port 8080 (Cloud Run uses this port by default)
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 