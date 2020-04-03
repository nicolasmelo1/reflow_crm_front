FROM node:13

WORKDIR /code

ADD package.json /code/
ADD .babelrc /code/
RUN npm install

COPY . /code/

EXPOSE 3000
CMD ["sh", "deploy.sh"]