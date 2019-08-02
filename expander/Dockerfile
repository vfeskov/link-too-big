# this Dockerfile expects the root of the project to be its context, e.g.:
# docker build -f expander/nodejs/Dockerfile .
FROM node:8-alpine

RUN mkdir -p /app/expander
WORKDIR /app/expander
ADD ./expander/package.json ./package.json
ADD ./expander/package-lock.json ./package-lock.json
RUN npm install

ADD ./expander .
ADD ./lib ../lib

CMD [ "npm", "start" ]

EXPOSE 10000

