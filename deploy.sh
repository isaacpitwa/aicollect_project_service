#!/bin/sh
ssh -o StrictHostKeyChecking=no rockside@$IP_TEST << 'ENDSSH'
  export $(cat .env | xargs)
  docker login -u $CI_REGISTRY_USER -p $CI_JOB_TOKEN $CI_REGISTRY
  docker pull $IMAGE:latest
  cd /home/rockside/api/clientservice
  docker-compose down
  docker-compose up --build -d

ENDSSH
