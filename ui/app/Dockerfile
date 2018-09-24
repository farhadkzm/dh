FROM node:8
RUN mkdir /app
COPY package.json /app
RUN cd /app && npm install
COPY . /app
