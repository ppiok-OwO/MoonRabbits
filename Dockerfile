FROM node:latest

RUN mkdir /app

WORKDIR /app

COPY package.json package-lock.json .prettierrc ./

RUN npm install

COPY ./ ./

EXPOSE 3000

ENTRYPOINT [ "npm", "start" ]