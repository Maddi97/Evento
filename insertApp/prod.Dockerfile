FROM node:17.4.0 as build

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

#RUN yarn cache clean --all
RUN npm cache clean --force

COPY package.json /app/package.json

RUN npm install --legacy-peer-deps

#RUN yarn install

COPY . /app

ENV NODE_OPTIONS="--max-old-space-size=8192"
RUN ng build --output-path=dist --sourceMap=false --prod=true

FROM nginx:1.16.0-alpine

COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
