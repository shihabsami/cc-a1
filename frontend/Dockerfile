FROM node:16.14.2-alpine as build-stage

COPY package.json .

COPY yarn.lock .

RUN yarn

COPY . .

RUN yarn build

RUN npm i -g serve

EXPOSE 3000

CMD ["npx", "serve", "-s", "build", "-n"]
