# Stage 1: Build Angular Application
FROM node:18.17.1 as build

WORKDIR /app

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

RUN npm ci

COPY . /app

RUN npm run build:ssr:prod

# Stage 2: Serve Angular Application
FROM node:18.17.1-alpine

WORKDIR /app

COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/dist /app/dist

RUN npm install --only=production

EXPOSE 4200

CMD npm run serve:ssr