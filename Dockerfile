FROM node:14-alpine AS build
ENV HOME /opt/srm-dex-fe

ARG APP_ENV_ARG
ENV APP_ENV $APP_ENV_ARG
ENV PATH $HOME/node_modules/.bin:$PATH
ARG MAX_OLD_SPACE_SIZE=4096
ENV NODE_OPTIONS=--max-old-space-size=${MAX_OLD_SPACE_SIZE}

WORKDIR $HOME
COPY . $HOME/

# yarn install
RUN set -x && \
    npm install -g lerna && \
    yarn install && \
    yarn --version && \
    yarn prebuild && \
    npm i -g npm && \
    npm --version && \
    yarn postbuild

# yarn build
RUN set -x && \
    cp $HOME/.env.$APP_ENV $HOME/.env && \
    cat $HOME/.env && \
    yarn build:serum && \
    yarn build && \
    ls -la $HOME/build

FROM nginx:1.19
ENV HOME /opt/srm-dex-fe
WORKDIR $HOME
COPY .build $HOME/.build
COPY --from=build /opt/srm-dex-fe/build $HOME/build

RUN set -x && \
    rm -rf /etc/nginx/conf.d/default.conf && \
    cp $HOME/.build/.nginx/srm-dex-fe.conf /etc/nginx/conf.d/srm-dex-fe.conf && \
    nginx -t && \
    ls -la $HOME/build

STOPSIGNAL SIGTERM
CMD ["nginx", "-g", "daemon off;"]
