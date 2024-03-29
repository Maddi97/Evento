# Stage 1: Build the Angular app
FROM node:18-alpine as build
WORKDIR /app/src

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the entire app source code
COPY . ./

# Build the Angular app
RUN npm run build

# Stage 2: Create the production image
FROM node:18-alpine
WORKDIR /usr/app

# Copy the compiled output from the build stage
COPY --from=build /app/src/dist/evento/server ./dist

# Specify the command to run the SSR server (adjust the entry point name)
CMD node dist/main.js

# Expose the port (adjust as needed)
EXPOSE 4200
