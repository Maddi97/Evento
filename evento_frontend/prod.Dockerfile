FROM node:18.17.1 as build

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

RUN npm ci

COPY . /app

EXPOSE 4200
RUN npm run build:ssr
# CMD npm run serve:ssr
