FROM node:13

WORKDIR /code

ENV PATH /code/node_modules/.bin:$PATH

COPY . /code/

RUN npm install

EXPOSE 3000
CMD [ "npm", "run", "dev" ]