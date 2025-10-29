# Build stage
FROM node:18-alpine AS build

# Build arguments - Railway will pass these from Environment Variables
ARG REACT_APP_API_URL
ARG REACT_APP_STRIPE_PUBLIC_KEY
ARG REACT_APP_GOOGLE_MAPS_API_KEY
ARG REACT_APP_PAYPAL_CLIENT_ID

# Set as environment variables for build
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_STRIPE_PUBLIC_KEY=$REACT_APP_STRIPE_PUBLIC_KEY
ENV REACT_APP_GOOGLE_MAPS_API_KEY=$REACT_APP_GOOGLE_MAPS_API_KEY
ENV REACT_APP_PAYPAL_CLIENT_ID=$REACT_APP_PAYPAL_CLIENT_ID

WORKDIR /app

# Copy package files
COPY package*.json ./

# Clean install dependencies with resolutions
RUN rm -f package-lock.json && \
    npm install --legacy-peer-deps && \
    npm install ajv@^8.12.0 --save-exact --legacy-peer-deps

# Copy source code
COPY . .

# Build production with env vars
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files to nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
