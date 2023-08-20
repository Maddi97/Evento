DOCKER_CONTAINER = 'backend'
IMAGE_PATH = 'app'

docker cp /home/evento/backup/mongodb_backup/IMAGE_BACKUP/ ${DOCKER_CONTAINER}:/${IMAGE_PATH} 

mongorestore -db /home/evento/backup/mongodb_backup/07Aug2023/db_evento