# Stage 1: Build the Angular app
FROM node:18.17.1 as build
WORKDIR /app

# Set the PATH to include node_modules binaries
ENV PATH /app/node_modules/.bin:$PATH

# Copy package.json and package-lock.json
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

# Install dependencies
RUN npm ci

# Copy the rest of the app
COPY . /app

# Expose port 4200
EXPOSE 4200

# Build the app with SSR
RUN npm run build:ssr:prod

# Stage 2: Create the final image
FROM node:18.17.1
WORKDIR /app

# Copy the SSR build output from the previous stage
COPY --from=build /app/dist/evento/server ./dist/evento/server

# Start the SSR server
CMD npm run serve:ssr
