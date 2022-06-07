
export PATH=/bin:/usr/bin:/usr/local/bin

DOCKER_CONTAINER = 'backend'
IMAGE_PATH = 'app/images'

docker cp ${DOCKER_CONTAINER}:/${IMAGE_PATH} ./mongodb_backup/IMAGE_BACKUP/
