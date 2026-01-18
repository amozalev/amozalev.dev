---
title: Общие типы для NestJS, Svelte и Telegram-бота в приложении с Docker
description:
    Генерация типов API на NestJS в общую папку для браузерных и серверных клиентов, с учётом различий в сборке и модульных системах.
    Использование подхода в микросервисном приложении на Docker Compose как в development, так и production режимах.
datetime: 2026-01-18
image: cover.webp
ogImage: cover.png
tags:
    - nestjs
    - svelte
    - telegram
    - docker
---

![Общие типы API на NestJS для клиентов на SvelteKit и Telegram бота в Docker](/images/posts/shared-types-folder-in-docker-apps/{image})

Когда в приложении есть API и несколько клиентов, появляются следующие потребности:

- Получать типы API по запросу в отдельную папку, которая будет использоваться всеми клиентам, таком образом, избежать дублирования кода и иметь один источник данных.
- Использование папки/ пакета должно быть возможно во время разработки и production сборках в Docker контейнерах.

### Структура проекта

```
app/
├── api/
│	├── src/
│	├── Dockerfile
│	├── package.json
│	└── tsconfig.json
├── frontend/
│	├── .svelte-kit/
│	├── tsconfig.json
│	├── src/
│	├── Dockerfile
│	├── api_client/             sym.link  - -|
│	├── svelte.config.js                     |
│	├── package.json                         |
│	└── tsconfig.json                        |
├── bot/                                     |
│	├── src/                                 |
│	├── Dockerfile                           |
│	├── package.json                         |
│	└── tsconfig.json                        |
├── shared/                                  |
│	├── api_client/             <- - - - - - |
│		├── src/
│ 		    ├── api/
│    		    ├── types/
│			    └── index.ts
│		├── package.json
│		└── tsconfig.json
├── docker-compose.dev.yml
└── docker-compose.yml
```

### Docker compose

Важным является то, что надо запускать сервисы в контексте корня проекта, потому, что в production сборке Docker образов надо копировать папку `shared/api_client` внутрь, но по соображениям безопасности Docker не даёт копировать файлы, находящиеся вне контекста, т.е. в данном случае `shared/api_client` находится на уровень выше, чем файлы `frontend` и `bot`.

`docker-compose.dev.yml`:

```yml
services:
    frontend:
        build:
            context: .
            dockerfile: ./frontend/Dockerfile
            target: dev
        ports:
            - '3000:3000'
        volumes:
            - ./frontend:/app
            - ./shared/api_client:/app/api_client:delegated
            - /app/node_modules
        env_file:
            - .env
        depends_on:
            - api
        networks:
            - network
        stdin_open: true
        tty: true
        command: ['yarn', 'dev', '--host']

    api:
        build:
            context: ./api
            target: dev
        env_file:
            - .env
        volumes:
            - ./api:/app
            - /app/node_modules
        ports:
            - '8080:8080'
        networks:
            - network

    bot:
        build:
            context: .
            dockerfile: ./bot/Dockerfile
            target: dev
        env_file:
            - ./bot/.env
        depends_on:
            - api
        volumes:
            - ./bot:/node/app
            - ./shared/api_client:/node/shared/api_client:delegated
            - /node/app/node_modules
        ports:
            - '8081:8081'
        networks:
            - network

networks:
    network:
        driver: bridge
```

В development используются volumes, а в production необходимо копировать `shared/api_client` в образ.

`frontend/Dockerfile:`

```Dockerfile
FROM node:22-alpine AS dev

WORKDIR /app

COPY frontend/package.json frontend/yarn.lock ./

RUN yarn install --frozen-lockfile

EXPOSE 3000

CMD ["yarn", "dev", "--host"]


FROM node:22-alpine AS build

WORKDIR /app

COPY frontend/package.json frontend/yarn.lock ./

RUN yarn install --frozen-lockfile

COPY frontend/ .
COPY shared/api_client ./api_client

RUN yarn prepare

RUN yarn build


FROM node:22-alpine as prod

WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --chown=appuser:appgroup --from=build /app/build ./build

COPY --chown=appuser:appgroup frontend/package.json frontend/yarn.lock ./

RUN yarn install --production --frozen-lockfile && \
    yarn cache clean && \
    apk add --no-cache curl

EXPOSE 3000

USER appuser

CMD ["node", "build/index.js"]
```

`bot/Dockerfile:`

```Dockerfile
FROM node:22-alpine AS dev

WORKDIR /node

COPY bot/package.json bot/yarn.lock bot/tsconfig.json bot/.env ./

RUN yarn install --frozen-lockfile

WORKDIR /node/app

EXPOSE 8081

CMD ["sh", "-c", "yarn dev"]


FROM node:22-alpine AS build

WORKDIR /node/app

COPY bot/package.json bot/yarn.lock bot/tsconfig.json ./

RUN yarn install --frozen-lockfile

COPY bot/ .
COPY shared/api_client ../shared/api_client

ARG API_URL
ENV API_URL=$API_URL

RUN yarn build

EXPOSE 8081


FROM node:22-alpine as prod

WORKDIR /node/app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --chown=appuser:appgroup --from=build /node/app/dist ./dist

COPY --chown=appuser:appgroup bot/package.json bot/yarn.lock ./

ARG API_URL
ENV API_URL=$API_URL

RUN yarn install --production --frozen-lockfile && \
    yarn cache clean

EXPOSE 8081

USER appuser

CMD ["node", "dist/index.js"]
```

### NestJS API

В NestJS есть официальная библиотека @nestjs/swagger, которая позволяет интегрировать генерацию динамической документации в соответствии со Swagger (OpenAPI). В main.ts надо настроить URL, по которому `shared/api_client` сможет получать актуальную документацию.

`main.ts`:

```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    const config = new DocumentBuilder()
        .setTitle('My API')
        .setDescription('Your API description')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document, {
        jsonDocumentUrl: 'swagger/json'
    });

    app.setGlobalPrefix('api');
    await app.listen(process.env.PORT ?? 8080);
}

bootstrap();
```

Также необходимо подготовить все DTO и схемы, которые должны попасть в общий пакет. Например, `create-user.dto.ts`:

```ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
    @ApiPropertyOptional({
        description: 'User name'
    })
    @IsOptional()
    @IsString()
    userName?: string;
}
```

### shared/api_client

Это маленькое приложение, которое получает типы API скриптом `generate` в `package.json`.

```json
{
    "name": "api_client",
    "version": "0.0.1",
    "description": "Shared API client",
    "main": "src/api/index.ts",
    "type": "module",
    "scripts": {
        "generate": "openapi --input http://localhost:8080/swagger/json --output src/api/types",
        "format": "prettier --write ."
    },
    "devDependencies": {
        "@eslint/js": "^9.39.2",
        "openapi-typescript-codegen": "^0.29.0",
        "prettier": "^3.6.2",
        "typescript-eslint": "^8.51.0"
    },
    "exports": {
        ".": "./src/api"
    }
}
```

Дополнительно к типам здесь реализована логика запросов к API.

```ts
import type { UserResponseDto, CreateUserDto, UpdateUserDto } from './types/index.js';
import { HttpClient } from './types.js';

export const usersApi = (api: HttpClient) => ({
    async getOneByTgId(id: number): Promise<UserResponseDto> {
        return await api.get(`/users/${id}`);
    },

    async create(data: CreateUserDto): Promise<UserResponseDto> {
        return await api.post('/users', data);
    },

    async update(id: string, data: UpdateUserDto): Promise<UserResponseDto> {
        return await api.patch(`/users/${id}`, data);
    }
});
```

Каждый потребитель API создаёт свой собственный объект axios. Например, так:

```ts
import axios from 'axios';
import { userApi } from '$api';

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? '/api'
});

const user = await userApi(apiClient).getOneByTgId('1');
```

Типы используется и в браузерном приложении (frontend) и в серверном (bot). Я не делаю сборку, но хочу, чтобы можно было использовать и в development и production режимах. Это накладывает важные ограничения.

Минимальный `tsconfig.json`:

```json
{
    "compilerOptions": {
        "target": "es2023",
        "strict": true,
        "moduleResolution": "nodenext"
    }
}
```

`moduleResolution` должен быть `nodenext` для того, чтобы все импорты были с расширением `.js` и не было возможности импортировать модули внутри папки без расширения.
Импорт без расширения подойдёт для браузерных приложений, но сломает приложение NodeJS. Это обязательно по стандарту ECMAScript модулей в Node.

Для своевременной подсветки неправильного импорта в IDE я добавил правила для ESlint. Ключевое правило здесь `import/extensions`:

```js
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(eslint.configs.recommended, ...tseslint.configs.recommended, {
    files: ['src/**/*.ts'],
    languageOptions: {
        parser: tseslint.parser,
        parserOptions: {
            project: './tsconfig.json'
        }
    },
    rules: {
        'import/extensions': ['error', 'always'],
        'import/no-useless-path-segments': ['error', { noUselessIndex: false }]
    }
});
```

Почему импорт `.js` файлов, а не `.ts`, ведь у меня приложение с Typescript? Возможность импортировать `.ts` модули, включается опцией [`allowImportingTsExtensions`, которая требует наличия `noEmit` или `emitDeclarationOnly` в tsconfig.json](https://www.typescriptlang.org/tsconfig/#allowImportingTsExtensions), что делает невозможным использовать эти настройки в production. Т.е. тогда бы в сборке присутствовали только типы без JS файлов.

### frontend

В SvelteKit alias путей редактируются в svelte.config.js. В результате генерируется `.svelte-kit/tsconfig.json`. Это создаёт нужные пути для содержимого docker контейнера.
Минимальный svelte.config.js:

```json
const config = {
    kit: {
        alias: {
            $apiClient: path.resolve('./src/api/*'),
            $api: path.resolve('./api_client/src/api/'),
		},
    }
};
```

В корне `frontend` лежит `tsconfig.json`, расширяющий упомянутый выше:

```json
{
    "extends": "./.svelte-kit/tsconfig.json",
    "compilerOptions": {
        "allowImportingTsExtensions": true,
        "allowJs": true,
        "checkJs": true,
        "esModuleInterop": true,
        "forceConsistentCasingInFileNames": true,
        "resolveJsonModule": true,
        "skipLibCheck": true,
        "sourceMap": true,
        "strict": true,
        "moduleResolution": "bundler"
    }
}
```

Этого достаточно, чтобы приложение видело `api_client` в docker контейнере (обратите внимание на volumes в dev конфигурации сервиса frontend). Volume с `api_client` монтируется в папку `app`.
Однако в файловой системе хоста, папка `shared` лежит на один уровень выше, относительно корня сервиса, поэтому в IDE возникают ошибки ESlint или перестают работать подсказки типов.
![[Pasted image 20260117184122.png]]

Эту задачу я решил при помощи символьной ссылки на папку `shared/api_client`, которая лежит в папке `frontend`.

```
api_client -> ../shared/api_client
```

### bot

В development режиме бот запускается при помощи `tsx`. Это удобная альтернатива `ts-node` с watch режимом. В скрипте `dev` путь до файла в Docker контейнере.
В production я использую `tsup`. Это удобная обёртка над `esbuild`.

Минимальный `package.json`:

```json
{
    "name": "telegram-bot",
    "version": "1.0.0",
    "main": "dist/index.js",
    "type": "module",
    "scripts": {
        "dev": "tsx watch --env-file=.env /node/app/src/index.ts",
        "build": "tsup ./src/index.ts --format esm --dts --minify"
    }
}
```

В `tsconfig.json` нужно настроить пути до клиента API:

```json
{
    "compilerOptions": {
        "baseUrl": "./",
        "target": "ES2022",
        "module": "NodeNext",
        "moduleResolution": "NodeNext",
        "outDir": "dist",
        "allowImportingTsExtensions": false,
        "noEmit": false,
        "strict": true,
        "sourceMap": true,
        "paths": {
            "$api": ["../shared/api_client/src/api/index.ts"],
            "$api/*": ["../shared/api_client/src/api/*"]
        }
    },
    "include": ["src"]
}
```

### Выводы

Данная схема оказалась удобна мне при работе c Docker Compose, как в production, так и в development. Более надёжным и универсальным, но и более трудозатратным решением было бы преобразовать `shared/api_client` в библиотеку.
