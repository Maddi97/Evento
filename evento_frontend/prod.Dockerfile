FROM --platform=$BUILDPLATFORM node:20.10-alpine AS builder

ENV INSTALL_PATH /app
RUN mkdir -p $INSTALL_PATH
WORKDIR $INSTALL_PATH
COPY ./package.json ./package-lock.json $INSTALL_PATH/
RUN npm install
COPY . $INSTALL_PATH
RUN npm run build:ssr:prod

FROM node:20.10-alpine AS runner

ENV NODE_ENV production
ENV PORT 4200

ENV INSTALL_PATH /app
RUN mkdir -p $INSTALL_PATH
WORKDIR $INSTALL_PATH
# COPY --from=builder $INSTALL_PATH/package.json $INSTALL_PATH/package-lock.json $INSTALL_PATH/
# RUN npm install --production
COPY --from=builder $INSTALL_PATH/dist $INSTALL_PATH/dist

EXPOSE 4200

CMD ["npm", "run", "serve:ssr"]
