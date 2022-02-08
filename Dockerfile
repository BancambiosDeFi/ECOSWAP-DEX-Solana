FROM node:14-alpine AS build

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# pre install
RUN npm install -g lerna

# install app dependencies
COPY package.json ./
COPY yarn.lock ./
RUN yarn

# add app
COPY ../. ./

# build serum modules
RUN cd serum && yarn && yarn build
