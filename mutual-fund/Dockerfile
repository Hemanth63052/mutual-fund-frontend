# Multi-stage build for React app
# Stage 1: Build the React application
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Serve the app with nginx
FROM nginx:alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built app from previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port (Cloud Run will use this)
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]