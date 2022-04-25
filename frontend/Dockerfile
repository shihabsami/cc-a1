### Build Stage ###
FROM node:16.14.2-alpine as build-stage
WORKDIR /usr/src/app
COPY package.json .
COPY tsconfig.json .
COPY yarn.lock .
RUN yarn install
COPY . .
RUN yarn build

### Run Stage ###
FROM node:16.14.2-alpine
WORKDIR /usr/src/app
COPY --from=build-stage /usr/src/app/build .
RUN export PATH="$(yarn global bin):$PATH"
RUN yarn global add serve
EXPOSE 3000
CMD ["serve", "-s", "-n"]
