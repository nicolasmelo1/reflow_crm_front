FROM node:13

# Setting working directory. All the path will be relative to WORKDIR
WORKDIR /code

# Installing dependencies
ADD requirements.txt /code/
RUN npm install

# Copying source files
COPY . /code/

# Building app
# Running the app
EXPOSE 3000
CMD ["sh", "deploy.sh"]