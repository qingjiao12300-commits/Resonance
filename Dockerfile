# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve with Python http.server (simpler and more compatible)
FROM python:3.11-alpine

WORKDIR /app

# Copy built files
COPY --from=builder /app/dist /app

# Expose port 7860 (required by ModelScope)
EXPOSE 7860

# Start Python HTTP server on port 7860
CMD ["python", "-m", "http.server", "7860", "--bind", "0.0.0.0"]
