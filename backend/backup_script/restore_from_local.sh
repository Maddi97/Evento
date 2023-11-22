##########################
USER='root'
HOST='h2970439.stratoserver.net'
#HOST='v2202310207729240622.luckysrv.de'
##########################

BACKEND_CONTAINER_LOCAL='evento_backend_container'
BACKEND_CONTAINER_SEVRER='backend'
IMAGE_PATH='app/images'

DB_NAME=db_evento
BACKUP_PATH_MONGO="local_instant_dump"

DB_BACKUP_PATH='/home/evento/backup/mongodb_instant_backup'
IMAGE_PATH='app/images'

#######
# DB
#######

# LOCAL DEV DB DUMP
# docker exec -i mongodb mongodump --host '0.0.0.0' --port '27017' --db ${DB_NAME} "" --out "backup/db_evento" --gzip
# docker cp "mongodb:/backup/db_evento" "../backup_local_dev/db_backup/"

# TRANSER LOCAL DB TO SERVER 
ssh "${USER}@${HOST}" "mkdir -p ${DB_BACKUP_PATH}/${BACKUP_PATH_MONGO}/${DB_NAME}/"
scp -r ../backup_local_dev/db_backup/. ${USER}@${HOST}:${DB_BACKUP_PATH}/${BACKUP_PATH_MONGO}/${DB_NAME}/ 

# COPY DB INTO MONGO DB DOCKER ON SERVER
ssh "${USER}@${HOST}" "docker exec mongodb bash -c 'mkdir -p backup/${BACKUP_PATH_MONGO}/${DB_NAME}'"
ssh "${USER}@${HOST}" ""docker cp ${DB_BACKUP_PATH}/${BACKUP_PATH_MONGO}/${DB_NAME}/. mongodb:/backup/${BACKUP_PATH_MONGO}/""

# migrate backup to db
ssh "${USER}@${HOST}" "docker exec mongodb bash -c 'mongorestore --gzip --uri mongodb://mongodb:27017/db_evento /backup/${BACKUP_PATH_MONGO}/db_evento'"
ssh "${USER}@${HOST}" "docker exec mongodb bash -c 'rm -f -r /backup/${BACKUP_PATH_MONGO}/'"


#########
# IMAGES
#########

#DUMP IMAGES FROM BACKEND
mkdir "../backup_local_dev/IMAGE_BACKUP/"
docker cp "${BACKEND_CONTAINER_LOCAL}:${IMAGE_PATH}/." "../backup_local_dev/IMAGE_BACKUP/"

# TRANSER IMAGES TO SERVER
ssh "${USER}@${HOST}" "mkdir -p ${DB_BACKUP_PATH}/${BACKUP_PATH_MONGO}/IMAGE_BACKUP/"
scp -r ../backup_local_dev/image_backup/. ${USER}@${HOST}:${DB_BACKUP_PATH}/${BACKUP_PATH_MONGO}/IMAGE_BACKUP/ 

# COPY IMAGES ON SERVER INTO DOCKER BACKEDND CONTAINER
ssh "${USER}@${HOST}" "docker cp ${DB_BACKUP_PATH}/${BACKUP_PATH_MONGO}/IMAGE_BACKUP/. ${BACKEND_CONTAINER_SEVRER}:/${IMAGE_PATH}"

