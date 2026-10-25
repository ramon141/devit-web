# Check out https://hub.docker.com/_/node to select a new base image
FROM docker.io/library/node:24.19.0-slim AS build

WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm ci

# Bundle app source code
COPY . .

# Build-time env (Vite bakes VITE_* vars into the bundle at build time)
ARG VITE_APP_BASE_API_URL
ENV VITE_APP_BASE_API_URL=${VITE_APP_BASE_API_URL}
ARG VITE_TURNSTILE_SITE_KEY
ENV VITE_TURNSTILE_SITE_KEY=${VITE_TURNSTILE_SITE_KEY}
ARG SITE_URL
ENV SITE_URL=${SITE_URL}

RUN npm run build

FROM docker.io/library/nginx:1.29-alpine AS runtime

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY nginx-security-headers.inc /etc/nginx/conf.d/nginx-security-headers.inc

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
