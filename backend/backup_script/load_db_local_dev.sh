#SERVER="root@h2970439.stratoserver.net"
SERVER="root@v2202310207729240622.luckysrv.de"

DOCKER_CONTAINER_SERVER='backend'
IMAGE_PATH_SERVER='app/images'

BACKUP_PATH_MONGO="instant_dump"

DOCKER_CONTAINER='evento_backend_container'
DB_BACKUP_PATH='/home/evento/backup/mongodb_instant_backup'
IMAGE_PATH='app/images'
DATE='12Jan2024'

MONGO_HOST='0.0.0.0'
MONGO_PORT='27017'

DB_NAME="db_evento"
AUTH_PARAM=""

check_and_create_dir() {
    if [ ! -d "$1" ]; then
        mkdir -p "$1"
    fi
}

#remove dump before
ssh ${SERVER} "rm -f -r ${DB_BACKUP_PATH}/instant_dump/"
#dump live database and copy it instant dump folder
ssh ${SERVER} " docker exec -i mongodb mongodump --host ${MONGO_HOST} --port ${MONGO_PORT} --db ${DB_NAME} ${AUTH_PARAM} --out ${BACKUP_PATH_MONGO} --gzip &&
docker cp mongodb:/${BACKUP_PATH_MONGO}/. ${DB_BACKUP_PATH}/instant_dump/"

# dump images from backend
ssh ${SERVER} "docker cp ${DOCKER_CONTAINER_SERVER}:/${IMAGE_PATH_SERVER} ${DB_BACKUP_PATH}/instant_dump/IMAGE_BACKUP/
"

# Check and create directories
check_and_create_dir "../backup_local_dev/db_backup/"
check_and_create_dir "../backup_local_dev/image_backup/"

#copy files to local pc
scp -r ${SERVER}:${DB_BACKUP_PATH}/instant_dump/${DB_NAME}/ ../backup_local_dev/db_backup/
scp -r ${SERVER}:${DB_BACKUP_PATH}/instant_dump/IMAGE_BACKUP/. ../backup_local_dev/image_backup

#copy images to docker container
docker cp ../backup_local_dev/image_backup/. ${DOCKER_CONTAINER}:/${IMAGE_PATH} 

docker exec -it mongodb bash -c 'mkdir -p /backup/db_evento'
docker cp ../backup_local_dev/db_backup/${DB_NAME}/. mongodb:/backup/db_evento

docker exec -it mongodb bash -c 'mongorestore --gzip --uri "mongodb://mongodb:27017/db_evento" backup/db_evento'

