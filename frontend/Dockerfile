# Stage 1: Build Angular 17 application
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN if [ -f package.json ]; then npm install; fi

COPY . .
RUN if [ -f angular.json ]; then \
      npm run build; \
    else \
      mkdir -p dist/meditrack-frontend/browser && cp index.html dist/meditrack-frontend/browser/index.html; \
    fi

# Stage 2: Serve static bundle via Nginx
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/meditrack-frontend/browser /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
