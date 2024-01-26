# Evento

This repository will implement an website/app for an event organizes. There are four components:

1. Backend
2. Frontend
3. Frontend - Insert
4. Mongo DB

## Design of Icons, Brandings, SVGs

Adobe Creative Cloud https://creativecloud.adobe.com/cc/?locale=en

## Running Production

To start the tech stack with docker run the following command:

```shell
docker-compose --env-file .env.prod -f docker-compose-deploy-dev.yml up -d --build
```

### production:

```shell
docker compose -f  docker-compose-prod.yml up -d
```

```shell
 docker compose -f docker-compose-prod.yml up  -d --force-recreate --no-deps --build mongodb

```

```shell
 docker compose --env-file .env.prod -f docker-compose-prod.yml up  -d --force-recreate --no-deps --build evento_frontend

```

If the containers have already been built one can just run:

```shell
docker-compose --env-file .env.prod -f docker-compose-deploy-dev.yml up -d
```

Afterwards the containers are reachable from the domain:

[Events](https://events.evento.duckdns.org)

[Insert](https://insert.evento.duckdns.org)

[Backend](https://backend.evento.duckdns.org)

## Local Development

For the local development the tech stack can be started with:

```shell
docker-compose -f docker-compose-local-developement.yml up --build
```

Also, if the containers have been built use:

```shell
docker-compose -f docker-compose-local-developement.yml up
```

The containers are then reachable via localhost and the specific ports:

[Events](http://localhost:4200)

[Insert](http://localhost:4201)

[Backend](http://localhost:3000)

Here only http is supported.

### Important Commands:

Rebuild only one container of the docker compose

```
docker-compose --env-file .env.dev -f docker-compose-local-developement.yml up  -d --build mongo
```

Rebuild backend

```
docker-compose --env-file .env.dev -f docker-compose-local-developement.yml up  -d --build backend
```

## How build and deploy of apps works

In docker file in app each container has own nginx proxy ( In local dockerfile managed)

## Fix deep links routing problem angular

- Nginx reverse proxy stuff is done in evento_app container
- index.html file is mapped from app/dist to usr/share/nginx/html in evento_app container
- nginx configuration is in etc/nginx/conf.d/default

## renew certificate

Renewal of certificates fail because of the mapping of the config folder outside of the docker volume Map inside again
and recreate Swag. If you want to renew automatic delete etcm crontabs and keys folder from letsencryptStrato folder and
push and recreate again. For debugging add those folder to avoid renewal.

Zum testen mit neuen Certifikat - zertifikat neuerstellen, config rauskopieren und startoConfig mit neuer config
aktualisieren

## TechStack

- node 16.13.2
- angular 13.1.3

## Backup

Images in case images get lost (because backend recreate i.e.)
by backup script images are restored in /home/event/backup/mongodb_back/IMAGE_BACKUP copy /images into backend docker
container (docker cp)

Right now backend and mongo db are never pushed or recreated
