FROM node:14.17.4-alpine3.14 as builder

ENV WORKDIR /app
WORKDIR $WORKDIR

RUN apk update && apk add git yarn

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .

RUN yarn build

FROM nginx

ARG VUE_APP_API_BASE_URL
ARG VUE_APP_USE_SENTRY
ARG VUE_APP_SENTRY_DSN
ARG VUE_APP_FACEBOOK_APP_ID
ARG VUE_APP_LOGROCKET_ID
ARG VUE_APP_PARENT_IFRAME_DOMAIN
ARG VUE_APP_HELPHERO_ID

ENV VUE_APP_API_BASE_URL $VUE_APP_API_BASE_URL
ENV VUE_APP_USE_SENTRY $VUE_APP_USE_SENTRY
ENV VUE_APP_SENTRY_DSN $VUE_APP_SENTRY_DSN
ENV VUE_APP_FACEBOOK_APP_ID $VUE_APP_FACEBOOK_APP_ID
ENV VUE_APP_LOGROCKET_ID $VUE_APP_LOGROCKET_ID
ENV VUE_APP_PARENT_IFRAME_DOMAIN $VUE_APP_PARENT_IFRAME_DOMAIN
ENV VUE_APP_HELPHERO_ID $VUE_APP_HELPHERO_ID

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist /usr/share/nginx/html/integrations

COPY docker-entrypoint.sh /usr/share/nginx/

RUN chmod +x /usr/share/nginx/docker-entrypoint.sh

ENTRYPOINT ["/usr/share/nginx/docker-entrypoint.sh"]

CMD ["nginx", "-g", "daemon off;"]