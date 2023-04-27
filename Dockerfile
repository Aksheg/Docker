FROM node:16-alpine

WORKDIR /base

COPY . .

COPY package.json yarn.lock ./

COPY .env /base/env

RUN yarn 

RUN yarn tsc

CMD ["node", "bin/www"]

EXPOSE 3000