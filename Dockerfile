FROM node:latest

RUN mkdir /app

WORKDIR /app

COPY package*.json .env ./

RUN npm install

COPY src ./

EXPOSE 3000

ENTRYPOINT [ "npm", "start" ]
