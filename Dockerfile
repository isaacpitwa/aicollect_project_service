FROM node:16-alpine
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile

ADD .env_temp .
# Copy source files into the image
COPY . .
COPY /.env_temp ./.env

EXPOSE 4000

CMD yarn start