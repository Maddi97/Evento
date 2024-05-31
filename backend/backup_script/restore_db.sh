##########################
USER='root'
#HOST='h2970439.stratoserver.net'
HOST='v2202310207729240622.luckysrv.de'
##########################

DOCKER_CONTAINER='backend'
IMAGE_PATH='app/images'
DATE='26Sep2023'

ssh "${USER}@${HOST}" "docker cp /home/evento/backup/mongodb_backup/IMAGE_BACKUP/ ${DOCKER_CONTAINER}:/${IMAGE_PATH}"
ssh "${USER}@${HOST}" "docker exec mongodb bash -c 'mkdir /backup'"
ssh "${USER}@${HOST}" ""docker cp /home/evento/backup/mongodb_backup/${DATE}/ mongodb:/backup/${DATE}/""

ssh "${USER}@${HOST}" "docker exec mongodb bash -c 'mongorestore --gzip --uri mongodb://mongodb:27017/db_evento backup/${DATE}/daily_backup/db_evento'"
ssh "${USER}@${HOST}" "docker exec mongodb bash -c 'rm -f -r backup/${DATE}'"