# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Clean install dependencies with resolutions
RUN rm -f package-lock.json && \
    npm install --legacy-peer-deps && \
    npm install ajv@^8.12.0 --save-exact --legacy-peer-deps

# Copy source code
COPY . .

# Build production
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files to nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
