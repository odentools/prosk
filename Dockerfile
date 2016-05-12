FROM node:5-wheezy
MAINTAINER OECU VMLab

ADD . /var/www
WORKDIR /var/www

RUN npm install --unsafe-perm --production

EXPOSE 8080
ENTRYPOINT ["npm", "start"]
