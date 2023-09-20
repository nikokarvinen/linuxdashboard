# File: backend/Dockerfile
FROM ubuntu:latest

RUN apt-get update \
    && apt-get install -y nodejs npm net-tools iproute2

COPY . .

RUN npm install

CMD ["npm", "start"]