###################
# BUILD FOR PRODUCTION
###################

FROM node:22-alpine AS build

WORKDIR /usr/app

COPY --chown=node:node ./package.json ./package.json
COPY --chown=node:node ./yarn.lock ./yarn.lock

RUN npm install --immutable --immutable-cache --check-cache

COPY --chown=node:node . .

RUN #npm run build
CMD ["yarn", "start:dev"]

###################
# PRODUCTION
###################

FROM node:22-alpine AS production

WORKDIR /usr/app

COPY --chown=node:node --from=build /usr/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/app/dist ./dist

ENTRYPOINT node dist/main.js