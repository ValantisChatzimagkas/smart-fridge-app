# Stage 1: build the static bundle
FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

# The API URL is baked into the bundle at build time.
ARG VITE_API_URL=http://localhost:8000
ENV VITE_API_URL=$VITE_API_URL

COPY . .
RUN npm run build

# Stage 2: serve with nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
