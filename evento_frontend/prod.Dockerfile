FROM node:18.17.1 as build


ENV PATH /node_modules/.bin:$PATH

RUN npm ci

ENV NODE_OPTIONS="--max-old-space-size=8192"
EXPOSE 4200
RUN npm run build:ssr
CMD npm run serve:ssr