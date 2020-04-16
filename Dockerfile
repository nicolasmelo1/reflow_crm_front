FROM node:13

WORKDIR /code
ADD package.json /code/
ADD merge.js /code/
ADD web/package.json /code/web/
RUN npm run merge web && npm run install:web

COPY shared /code/shared
COPY web /code/web
EXPOSE 3000
CMD ["sh", "deploy.sh"]