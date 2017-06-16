FROM node:6-alpine
ENV NPM_CONFIG_LOGLEVEL warn
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install --production  && \
    npm cache clean
COPY app.js /usr/src/app/
COPY www /usr/src/app/www
EXPOSE 6001
CMD [ "npm", "start" ]
