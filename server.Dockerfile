FROM oven/bun:alpine

WORKDIR /usr/local

COPY bun.lockb .
COPY package.json .
COPY apps ./apps
COPY packages ./packages

RUN bun install

WORKDIR /usr/local/apps/backend

ENTRYPOINT ["bun", "src/index.ts"]