# Dockerfile

FROM node:21.2-alpine

WORKDIR /app-server

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "start"]
