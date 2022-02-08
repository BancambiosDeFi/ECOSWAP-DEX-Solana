FROM node:14-alpine AS build
ENV HOME /opt/srm-dex-fe

ARG APP_ENV_ARG
ENV APP_ENV $APP_ENV_ARG
ENV PATH $HOME/node_modules/.bin:$PATH

WORKDIR $HOME
COPY . $HOME/

RUN set -x && \
    sleep 100000
#     npm install -g lerna

# COPY package.json ./
# COPY yarn.lock ./

# RUN set -x && \
#     yarn

# # add app
# COPY ../. ./

# # build serum modules
# RUN set -x && \
#     cd serum && \
#     yarn && \ 
#     yarn build
