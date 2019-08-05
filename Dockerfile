FROM node:alpine

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install
COPY . .

ARG MONGODB_URI
ENV MONGODB_URI=${MONGODB_URI}
ARG SG_TOKEN
ENV SG_TOKEN=${SG_TOKEN}

EXPOSE 8080

CMD [ "node", "server.js" ]