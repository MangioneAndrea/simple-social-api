FROM node:18.9-alpine3.15

WORKDIR /app

RUN npm i -g pnpm

COPY src ./src
COPY package.json ./
COPY tsconfig.json ./
COPY .npmrc ./

RUN pnpm i

ENTRYPOINT [ "pnpm", "run", "start" ]


