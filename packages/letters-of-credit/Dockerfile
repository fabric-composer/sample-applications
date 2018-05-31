FROM node:8-alpine
ENV NPM_CONFIG_LOGLEVEL warn
ENV PORT 6001
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN apk add --no-cache git && \
    npm install --production -g pm2 && \
    npm install --production  && \
    npm cache clean --force && \
    apk del git
COPY . /usr/src/app/
EXPOSE 6001
CMD [ "pm2-docker", "npm", "--", "start" ]