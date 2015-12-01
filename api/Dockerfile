FROM node:4

RUN mkdir /app && \
  npm install -g nodemon

WORKDIR /app

COPY ./package.json package.json
COPY ./nodemon.json nodemon.json
COPY ./src/ src/
COPY ./.babelrc .babelrc

RUN npm install

EXPOSE 4000

CMD npm start
