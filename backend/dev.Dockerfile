FROM --platform=linux/arm64 node:16.13.2

RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN apt-get update 

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json /app/package.json
RUN npm install

RUN npm install --save-dev @angular-devkit/build-angular

COPY . /app

CMD nodemon app.js
