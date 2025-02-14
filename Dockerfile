FROM node:latest

RUN mkdir /app

WORKDIR /app

COPY package*.json .env /app/

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "node", "src/server.js" ]