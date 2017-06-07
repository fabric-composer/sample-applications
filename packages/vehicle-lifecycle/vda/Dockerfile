FROM node:6-alpine
ENV NPM_CONFIG_LOGLEVEL warn
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json bower.json .bowerrc /usr/src/app/
RUN apk add --no-cache git && \
    npm install --production -g bower && \
    npm install --production  && \
    bower install && \
    bower cache clean && \
    npm uninstall -g bower && \
    npm cache clean && \
    apk del git
COPY . /usr/src/app/
EXPOSE 6001
CMD [ "npm", "start" ]
