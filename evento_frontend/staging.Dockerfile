FROM node:18.17.1 as build

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

RUN npm ci

COPY . /app

ENV NODE_OPTIONS="--max-old-space-size=8192"
RUN ng build --output-path=dist --configuration staging

FROM nginx:1.16.0-alpine

COPY --from=build /app/dist /usr/share/nginx/html

#deep links fix change the config file for nginx
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
