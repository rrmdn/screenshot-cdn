FROM buildkite/puppeteer:latest
# set working directory
WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
RUN yarn
ENV NODE_ENV=production

# add app
COPY . ./

# start app
CMD ["yarn", "start"]