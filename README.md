# 3vents51

This repository will implement an website/app for an event organizes. 
There are four components:
1. Backend
2. Frontend
3. Frontend - Insert
4. Mongo DB


## Running Production

To start the tech stack with docker run the following command:

```shell
docker-compose --env-file .env.prod -f docker-compose-prod.yml up -d --build
```

If the containers have already been built one can just run:

```shell
docker-compose --env-file .env.prod -f docker-compose-prod.yml up -d
```

Afterwards the containers are reachable from the domain:

[Events](https://events.3vents51.duckdns.org)

[Insert](https://insert.3vents51.duckdns.org)

[Backend](https://backend.3vents51.duckdns.org)


## Local Development

For the local development the tech stack can be started with:

```shell
docker-compose -f docker-compose-dev.yml up --build
```

Also, if the containers have been built use:

```shell
docker-compose -f docker-compose-dev.yml up
```

The containers are then reachable via localhost and the specific ports:

[Events](http://localhost:4200)

[Insert](http://localhost:4201)

[Backend](http://localhost:3000)

Here only http is supported.

## TechStack
* node 16.13.2
* angular 13.1.3 
