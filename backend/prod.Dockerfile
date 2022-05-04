FROM node:16.13.2 as build

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json /app/package.json
#COPY package-lock.json /app/package-lock.json
RUN npm install

RUN npm install --save-dev @angular-devkit/build-angular
COPY . /app

CMD node app.js
