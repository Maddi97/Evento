FROM node:18.17.1 as build

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

RUN npm ci

COPY . /app

RUN npm run build:ssr:prod

FROM node:18.17.1

RUN npm install pm2 -g

WORKDIR /app

## From ‘build’ stage copy over the artifacts
COPY --from=build /app/dist /app/dist
EXPOSE 4200

CMD ["pm2-runtime", "dist/server"]