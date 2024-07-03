## Installation

```bash
$ pnpm install
```

## up pgsql via docker
docker run --name docker-postgres -e POSTGRES_PASSWORD=mysecretpassword -e POSTGRES_DB=mydatabase -v ./pgdata:/var/lib/postgresql/data -p 5433:5432 -d postgres

docker stop docker-postgres
docker rm docker-postgres

psql -h localhost -p 5433 -U postgres -W

\c mydatabase
\dt

\q

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```
