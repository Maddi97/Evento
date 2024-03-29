#!/bin/bash

######################################################################
##
##   MongoDB Database Backup Script
##   Written By: Rahul Kumar
##   URL: https://tecadmin.net/shell-script-backup-mongodb-database/
##   Update on: June 20, 2020
##
######################################################################

export PATH=/bin:/usr/bin:/usr/local/bin
TODAY=`date +"%d%b%Y"`

######################################################################
######################################################################
BACKUP_PATH_MONGO='/backup/daily_backup'
BACKUP_PATH_SEVRVER='/home/evento/backup/mongodb_backup'
MONGO_HOST='0.0.0.0'
MONGO_PORT='27017'

# If mongodb is protected with username password.
# Set AUTH_ENABLED to 1
# and add MONGO_USER and MONGO_PASSWD values correctly

AUTH_ENABLED=0
MONGO_USER=''
MONGO_PASSWD=''


# Set DATABASE_NAMES to "ALL" to backup all databases.
# or specify databases names seprated with space to backup
# specific databases only.

DATABASE_NAMES='db_evento'
#DATABASE_NAMES='mydb db2 newdb'

## Number of days to keep local backup copy
BACKUP_RETAIN_DAYS=150

######################################################################
######################################################################

mkdir -p ${BACKUP_PATH_SEVRVER}/${TODAY}

AUTH_PARAM=""

if [ ${AUTH_ENABLED} -eq 1 ]; then
 AUTH_PARAM=" --username ${MONGO_USER} --password ${MONGO_PASSWD} "
fi

echo "Running backup for selected databases"
for DB_NAME in ${DATABASE_NAMES}
do
docker exec -i mongodb mongodump --host ${MONGO_HOST} --port ${MONGO_PORT} --db ${DB_NAME} ${AUTH_PARAM} --out ${BACKUP_PATH_MONGO} --gzip
docker cp mongodb:/${BACKUP_PATH_MONGO}/ ${BACKUP_PATH_SEVRVER}/${TODAY}/
docker exec -i mongodb mongodump --host ${MONGO_HOST} --port ${MONGO_PORT} --db ${DB_NAME} ${AUTH_PARAM} --out ${BACKUP_PATH_MONGO} --gzip
docker exec -i mongodb bash -c rm -f -r /${BACKUP_PATH_MONGO}/
done




######## Remove backups older than {BACKUP_RETAIN_DAYS} days  ########

DBDELDATE=`date +"%d%b%Y" --date="${BACKUP_RETAIN_DAYS} days ago"`

if [ ! -z ${BACKUP_PATH_SEVRVER} ]; then
      cd ${BACKUP_PATH_SEVRVER}
      if [ ! -z ${DBDELDATE} ] && [ -d ${DBDELDATE} ]; then
            rm -rf ${DBDELDATE}
      fi
fi

######################### End of script ##############################
