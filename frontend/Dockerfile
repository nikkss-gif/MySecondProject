# ---- Build Stage ----
FROM node:18-alpine AS build

WORKDIR /app

# Copy only package files first
COPY package*.json ./

RUN npm ci

# 👉 VERY IMPORTANT: Copy .env BEFORE vite build
COPY .env .env

# Copy source code
COPY . .

# Build the frontend
RUN npm run build

# ---- Production Stage ----
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
