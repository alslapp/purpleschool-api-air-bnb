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
e2e tests
```bash
npm run test:e2e
```
unit tests
```bash
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

```bash
npm i joi
```

```bash
npm i --save @nestjs/axios axios
```

```bash
npm install --save @nestjs/schedule
```
```bash
npm install --save-dev @types/cron
```

# Docker
для сборки сервера нужны 2 файла ENV
в файле .env нужно указать HTTP_PORT  
в файле .env.prod нужно все остальные данные

### Собрать на проде только Сервер
удалить контейнер
```bash
docker remove -f top-api-air-bnb
```
собрать новый сервер
```bash
npm run docker:build:server
```

### Собрать приложение в docker
```bash
npm run docker:build:app
```

### Собрать только базу данных в docker
```bash
npm run docker:build:db
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

### GHCR
```bash
файл - https://docs.github.com/en/actions/publishing-packages/publishing-docker-images
сначала локально на компе в консоли выполнить команду: (проверить в настройках гитхаба, чтобы токен не истек)
echo "GITHUB_TOKEN" | docker login ghcr.io -u USERNAME_GITHUB --password-stdin
```