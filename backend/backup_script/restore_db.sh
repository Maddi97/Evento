DOCKER_CONTAINER='backend'
IMAGE_PATH='app/images'

docker cp /home/evento/backup/mongodb_backup/IMAGE_BACKUP/ ${DOCKER_CONTAINER}:/${IMAGE_PATH} 

docker cp /home/evento/backup/mongodb_backup/${DATE_TO_RESTORE}/ mongodb:/backup

docker exec -it mongodb bash -c "mongorestore --gzip --uri mongodb://mongodb:27017/db_evento backup/22Aug2023/db_evento"
#mongorestore -db db_evento backup/07Aug2023/db_evento

#lokale

scp -r your_username@h2970439.stratoserver.net:/home/evento/backup/mongodb_backup/07Aug2023/db_evento