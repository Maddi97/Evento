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

For now the techstack only supports http. 
Therefore a letsencrypt docker container has to be added to create a certificate.
Then the nginx config has to be updated.


## Local Development

For the local development the tech stack can be started with:

```shell
docker-compose -f docker-compose-dev.yml up --build
```

Also, if the containers have been built use:

```shell
docker-compose -f docker-compose-dev.yml up
```

Here only http is supported.