FROM node:18-alpine

WORKDIR /home

COPY ./package.json ./
COPY ./yarn.lock ./
COPY ./packages/client ./packages/client
COPY ./packages/server ./packages/server
COPY ./packages/shared ./packages/shared

RUN yarn install

CMD ["yarn", "start:prod"]