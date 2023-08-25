## Description
Домашнее задание по курсу Purpleschool: NestJS - с нуля, современный backend на TypeScript и Node JS
(API для сервиса бронирования номеров)
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

### MongoDb
```bash
npm i @nestjs/mongoose mongoose
```
### class-transformer
```bash
npm i class-validator class-transformer
```
### mapped-types
```bash
npm i @nestjs/mapped-types
```

### Passport JWT
```bash
npm i @nestjs/jwt @nestjs/passport passport passport-jwt
```
```bash
npm i -D @types/passport-jwt
```

### node-argon2
https://www.npmjs.com/package/argon2

It's possible to hash using either Argon2i, Argon2d or Argon2id (default), and verify if a password matches a hash.
```bash
npm i argon2
```
### Joi
https://github.com/hapijs/joi
```bash
npm i joi
```
### Axios
```bash
npm i --save @nestjs/axios axios
```
### Schedule
```bash
npm install --save @nestjs/schedule
```
```bash
npm install --save-dev @types/cron
```

### NestJs Microservices
```bash
npm i --save @nestjs/microservices
```
### RabbitMQ
```bash
npm i --save amqplib amqp-connection-manager
```

# Docker
для сборки сервера нужны 2 файла ENV
в файле .env нужно указать HTTP_PORT  
в файле .env.prod нужно все остальные данные

### Собрать приложение и бд в docker
```bash
npm run docker:build:app
```

Cобрать ТОЛЬКО приложение
```bash
npm run docker:build:server
```

Собрать ТОЛЬКО базу данных в docker
```bash
npm run docker:build:db
```

Войти в консоль контейнера
```bash
docker logs -f top-api-air-bnb
```

Пересобрать всё
```bash
npm run docker:rebuild:app
```
### Очистить docker

Удалить контейнер
```bash
docker remove -f top-api-air-bnb
```

#### удалить все, кроме volume:
```bash
docker stop $(docker ps -a -q) && docker system prune -a
```
#### удалить все volumes: 
```bash
docker volume rm $(docker volume ls -q)
```

#### если на VirtualBox не работает mongo v5+, можно поставить v4
добавить в docker-compose-db.yml
```bash
image: mongo:4.4.6
```

### GHCR
файл - https://docs.github.com/en/actions/publishing-packages/publishing-docker-images
сначала локально на компе в консоли выполнить команду: (проверить в настройках Github, чтобы токен не истек)
```bash
echo "GITHUB_TOKEN" | docker login ghcr.io -u USERNAME_GITHUB --password-stdin
```