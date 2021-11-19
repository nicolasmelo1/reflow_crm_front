FROM node:16

WORKDIR /code
ADD package.json /code/
ADD merge.js /code/
ADD web/package.json /code/web/

# THIS IS FOR PUPPETEER TO WORK, REFER TO: https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#running-puppeteer-in-docker
# Install latest chrome dev package and fonts to support major charsets (Chinese, Japanese, Arabic, Hebrew, Thai and a few others)
# Note: this installs the necessary libs to make the bundled version of Chromium that Puppeteer
# installs, work.
RUN apt-get update && apt-get -yq upgrade && apt-get install \
    && apt-get autoremove && apt-get autoclean
    
RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

RUN npm run install:web && \
    npm run install:web puppeteer \
    && groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /code/web/node_modules \
    && chown -R pptruser:pptruser /code/package.json \
    && chown -R pptruser:pptruser /code/web/package.json \
    && chown -R pptruser:pptruser /code/web/package-lock.json 

USER pptruser

COPY . /code
EXPOSE 3000
CMD ["sh", "deploy.sh"]