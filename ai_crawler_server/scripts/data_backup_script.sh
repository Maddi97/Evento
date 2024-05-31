#!/bin/bash

export PATH=/bin:/usr/bin:/usr/local/bin

DOCKER_CONTAINER='crawler_container'
DATASET_PATH='app/datasets'
TODAY=`date +"%d%b%Y"`
BACKUP_PATH='/home/evento/datasets'
mkdir -p ${BACKUP_PATH}/${TODAY}

docker cp ${DOCKER_CONTAINER}:/${DATASET_PATH} ${BACKUP_PATH}/${TODAY}
docker exec -i ${DOCKER_CONTAINER} rm -r -f /${DATASET_PATH}/