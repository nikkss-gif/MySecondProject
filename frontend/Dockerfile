# STEP 1: Build Stage
FROM node:20-alpine AS build

WORKDIR /app

# install deps first
COPY package*.json ./
RUN npm ci

# copy env BEFORE copying full project
COPY .env .env

# now copy rest of project
COPY . .

# build frontend
RUN npm run build

# STEP 2: Production Stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
