DOCKER_CONTAINER='backend'
IMAGE_PATH='app/images'
DATE='23Sep2023'

ssh "root@h2970439.stratoserver.net" "docker cp /home/evento/backup/mongodb_backup/IMAGE_BACKUP/ ${DOCKER_CONTAINER}:/${IMAGE_PATH}"
ssh "root@h2970439.stratoserver.net" ""docker cp /home/evento/backup/mongodb_backup/${DATE}/ mongodb:/backup/${DATE}/""

ssh "root@h2970439.stratoserver.net" "docker exec mongodb bash -c 'mongorestore --gzip --uri mongodb://mongodb:27017/db_evento backup/${DATE}/daily_backup/db_evento'"
ssh "root@h2970439.stratoserver.net" "docker exec mongodb bash -c 'rm -f -r backup/${DATE}'"