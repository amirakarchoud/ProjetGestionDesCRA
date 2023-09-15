FROM node:18
LABEL authors="sofientouati"

RUN mkdir /app

WORKDIR /app

COPY back/package*.json ./

RUN npm ci --production

COPY ./back .

RUN npm run build

EXPOSE 1337

CMD ["npm", "start"]



