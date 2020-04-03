FROM node:13

WORKDIR /code

ENV PATH /code/node_modules/.bin:$PATH

COPY . /code/

RUN npm install

CMD [ "npm", "run", "dev" ]