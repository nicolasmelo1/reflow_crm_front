FROM node:13

WORKDIR /code
ADD package.json /code/
RUN npm install

COPY . /code/
EXPOSE 3000
CMD [ "npm", "run", "dev" ]