FROM docker.io/node:20.18.0 as builder

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . ./
RUN pnpm run build

EXPOSE 4173

CMD [ "pnpm", "preview", "--host" ]
