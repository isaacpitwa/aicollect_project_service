FROM node:12.19.0-alpine
RUN  apk add --update --no-cache g++ make curl jq py3-configobj py3-pip py3-setuptools python3 python3-dev

RUN ["mkdir", "-p", "/logs/"]
COPY package*.json ./
COPY gulpfile.js ./

RUN mkdir -p ~/secrets
RUN npm install  node-gyp gulp -g
RUN npm install
RUN npm audit fix

COPY . ./
RUN gulp build
CMD ["npm","start"]
EXPOSE 4000