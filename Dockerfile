FROM node:16-alpine

WORKDIR /app

ENTRYPOINT ["sh", "./setup.sh"]
