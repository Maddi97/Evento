DOCKER_CONTAINER='backend'
IMAGE_PATH='app/images'

DB_NAME=db_evento
BACKUP_PATH_MONGO="local_instant_dump"

DB_BACKUP_PATH='/home/evento/backup/mongodb_instant_backup'
IMAGE_PATH='app/images'

ssh "root@h2970439.stratoserver.net" "mkdir ${DB_BACKUP_PATH}/${BACKUP_PATH_MONGO}/${DB_NAME}/"
ssh "root@h2970439.stratoserver.net" "mkdir ${DB_BACKUP_PATH}/${BACKUP_PATH_MONGO}/IMAGE_BACKUP/"
scp -r ../backup_local_dev/db_backup/. root@h2970439.stratoserver.net:${DB_BACKUP_PATH}/${BACKUP_PATH_MONGO}/${DB_NAME}/ 
scp -r ../backup_local_dev/image_backup/. root@h2970439.stratoserver.net:${DB_BACKUP_PATH}/${BACKUP_PATH_MONGO}/IMAGE_BACKUP/ 

ssh "root@h2970439.stratoserver.net" "docker cp ${DB_BACKUP_PATH}/${BACKUP_PATH_MONGO}/IMAGE_BACKUP/ ${DOCKER_CONTAINER}:/${IMAGE_PATH}"

ssh "root@h2970439.stratoserver.net" "docker exec mongodb bash -c 'mkdir -p backup/${BACKUP_PATH_MONGO}/${DB_NAME}'"
ssh "root@h2970439.stratoserver.net" ""docker cp ${DB_BACKUP_PATH}/${BACKUP_PATH_MONGO}/${DB_NAME}/ mongodb:/backup/${BACKUP_PATH_MONGO}/""

ssh "root@h2970439.stratoserver.net" "docker exec mongodb bash -c 'mongorestore --gzip --uri mongodb://mongodb:27017/db_evento backup/${BACKUP_PATH_MONGO}/${DB_NAME}'"
ssh "root@h2970439.stratoserver.net" "docker exec mongodb bash -c 'rm -f -r backup/${BACKUP_PATH_MONGO}/${DB_NAME}'"