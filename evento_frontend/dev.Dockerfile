FROM node:18.17.1

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

#RUN yarn cache clean --all
RUN npm cache clean --force

COPY package.json /app/package.json

RUN npm install --legacy-peer-deps

#RUN yarn install

COPY . /app

CMD ng run evento:serve-ssr --host 0.0.0.0 --configuration=dev
