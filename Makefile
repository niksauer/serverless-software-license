name = serverless-software-license
version = $(shell git describe --tags --dirty --always --long)

PROJECT_ROOT = $(shell pwd)

DEV_IMAGE_NAME = ${name}-dev
DEV_IMAGE_VERSION = ${version}
DEV_CONTAINER_NAME = ${DEV_IMAGE_NAME}

all:
	docker build -t ${DEV_IMAGE_NAME} .

rebuild: destroy all

logs:
	docker logs -f ${DEV_CONTAINER_NAME}

start:
	docker start ${DEV_CONTAINER_NAME} || docker run -it -d --name ${DEV_CONTAINER_NAME} -v ${PROJECT_ROOT}/src:/app/src ${DEV_IMAGE_NAME}

shell:
	docker exec -it ${DEV_CONTAINER_NAME} /bin/bash

stop:
	docker stop ${DEV_CONTAINER_NAME}

destroy: stop
	docker rm ${DEV_CONTAINER_NAME}
