FROM node:18.17.1 as build

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

RUN npm ci

COPY . /app

RUN ng build --configuration production && ng run evento:server
EXPOSE 4200

CMD ["npm run serve:ssr"]