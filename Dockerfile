FROM node:15-alpine
WORKDIR /app
COPY package.json /app
COPY package-lock.json .

RUN npm i
COPY . /app
CMD [ "npm" ,"start"]


