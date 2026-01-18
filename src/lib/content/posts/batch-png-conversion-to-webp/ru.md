---
title: Пакетное преобразование PNG в WEBP в JS приложении
description: Как верстать сайт по шаблону Figma и сразу использовать в разработке WEBP вместо PNG.
datetime: 2025-06-09
image: cover.webp
ogImage: cover.png
tags:
    - javascript
    - node
---

![пакетное преобразование png в webp](/images/posts/batch-png-conversion-to-webp/{image})

В одном из проектов, в котором я ставил целью попрактиковать и освежить какие-то нюансы вёрстки по шаблону Figma, я
понял, что сразу хочу использовать в коде WEBP изображения. В файлах Figma изображения можно скопировать в виде PNG,
SVG или кода. Таким
образом, уже в начале работы, я хотел иметь под рукой WEBP файлы.

WEBP более легковесный формат, по сравнению с JPG и PNG и имеет хорошую поддержку браузеров.
К тому же, это помогало мне сразу понимать скорость загрузки приложения, увидеть места, требующие оптимизации и оценить
финальный
вес сборки.

Приложение было на React, поэтому я положил все исходные изображения в папку `assets/images`, чтобы их можно было
импортировать из кода. Кстати, в этом блоге я использую тот же подход.

Я использовал Webpack, поэтому уже на этапе сборки приложения я получал бы ошибки, связанные с отсутствием
одноимённых WEBP изображений. На самом деле, не важно какой сборщик я бы использовал. Суть задачи была бы такой же. То
есть, уже до запуска приложения, мне надо было их иметь в папке `assets/images`, а
уже дальше Webpack копировал их в сборку.
В случае, если изображений немного, то можно было предварительно использовать один из конвертеров изображений в
интернете и преобразовать их
вручную. Этот вариант мне не понравился и я выбрал использование библиотек `imagemin` и `imagemin-webp`.
Установка:

```sh
npm install -D imagemin imagemin-webp
```

В документации к `imagemin-webp` даётся аналогичный пример скрипта, который я и использовал:

```typescript
import imagemin from 'imagemin';
import webp from 'imagemin-webp';

await imagemin(['src/assets/images/`.{jpg,png}'], {
    destination: 'src/assets/images',
    plugins: [webp({ quality: 60 })]
});
```

Я поместил этот код в файл `webp-images-generation.mjs` и добавил в `package.json` скрипт, выполняющийся перед скриптами
запуска dev и production сборок `start` и `build`, соответственно `prestart` и `prebuild`:

```json
{
    "scripts": {
        "prestart": "node webp-images-generation.mjs",
        "start": "webpack serve --mode development --config webpack.dev.config.js",
        "prebuild": "node webp-images-generation.mjs",
        "build": "webpack --mode production --config webpack.prod.config.js"
    }
}
```

Таким образом, в момент запуска скриптов `start` и `build`, в папке с изображениями уже есть все необходимые файлы.
