FROM node:16.2.0

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json /app/package.json

RUN yarn install

COPY . /app

CMD ng serve --host 0.0.0.0 --prod=false
