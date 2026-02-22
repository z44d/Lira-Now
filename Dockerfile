FROM oven/bun:latest

COPY . /app

WORKDIR /app

RUN bun install

EXPOSE 3000

CMD ["bun", "run", "server:dev"]