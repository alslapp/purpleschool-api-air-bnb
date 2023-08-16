## Description

Домашнее задание Purpleschool: NestJS - с нуля, современный backend на TypeScript и Node JS

Простой сервис бронироновая номеров.
### Running the app

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

### Test

```bash
# e2e tests
npm run test:e2e

# unit tests
npm run test
```

## Дабавленные пакеты

### Nestjs packages
```bash
npm i @nestjs/mongoose mongoose
npm i class-validator class-transformer
npm i @nestjs/mapped-types
```

### Passport JWT
```bash
npm i @nestjs/jwt @nestjs/passport passport passport-jwt
npm i -D @types/passport-jwt
```

### node-argon2
https://www.npmjs.com/package/argon2

It's possible to hash using either Argon2i, Argon2d or Argon2id (default), and verify if a password matches a hash.

```bash
npm i argon2
```

### Собрать приложение в docker
```bash
docker compose -f docker-compose-app.yml -f docker-compose-app-2.yml -f docker-compose-db.yml up -d
```

### Собрать только базу данных в docker
```bash
docker compose -f docker-compose-db.yml up -d
```

### Собрать только сервер в docker
```bash
docker compose -f docker-compose-app.yml up -d
```

### Войти в консоль контейнера
```bash
docker logs -f top-api-air-bnb
```

### Очистить docker
#### удалить все, кроме volume:
```bash
docker stop $(docker ps -a -q) && docker system prune -a
```
#### удалить все volumes:
```bash
docker volume rm $(docker volume ls -q)
```

#### на VirtualBox не работает mongo v5+, можно поставить образ v4
```bash
image: mongo:4.4.6
```
