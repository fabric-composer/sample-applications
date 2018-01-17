FROM node:8-alpine
ENV NPM_CONFIG_LOGLEVEL warn
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json bower.json .bowerrc /usr/src/app/
RUN apk add --no-cache git && \
    npm install --production -g bower pm2 && \
    npm install --production  && \
    bower install && \
    bower cache clean && \
    npm uninstall -g bower && \
    npm cache clean --force && \
    apk del git
COPY . /usr/src/app/
EXPOSE 6001
CMD [ "pm2-docker", "npm", "--", "start" ]
