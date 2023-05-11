FROM node:16-alpine as base
WORKDIR /code
EXPOSE 8080
COPY package.json /code/
COPY .npmrc /code/

FROM base as dependencies
COPY package-lock.json /code/
RUN apk --update --no-cache add --virtual build-dependencies make gcc g++ python3 && \
  npm ci --only=production

FROM dependencies as develop
ENV NODE_ENV=development
RUN apk add bash && \
  npm ci
COPY . /code
RUN npm run build && \
  apk del build-dependencies

FROM base as release
ENV NODE_ENV=production
COPY --from=dependencies /code/node_modules /code/node_modules
COPY --from=develop /code/build /code/build
COPY --from=develop /code/config /code/config

RUN adduser -D -h /code -u 2000 nary && chown -R nary:nary /code
USER nary

CMD ["node",  "build/index.js"]
