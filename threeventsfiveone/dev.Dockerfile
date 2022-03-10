FROM node:17.4.0

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

#RUN yarn cache clean --all
RUN npm cache clean --force

COPY package.json /app/package.json

RUN npm install --legacy-peer-deps

#RUN yarn install

COPY . /app

CMD ng serve --host 0.0.0.0 --sourceMap=false --prod=false
