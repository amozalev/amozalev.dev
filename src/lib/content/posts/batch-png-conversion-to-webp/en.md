---
title: Batch PNG images conversion to WEBP in JavaScript application.
description: How to develop a website layout from a Figma template instantly using optimized WEBP images instead of exported PNG ones.
datetime: 2025-06-09
image: cover.webp
tags:
  - javascript
  - node
---

![](/images/posts/batch-png-conversion-to-webp/cover.webp)

In one of the projects, in which I used a Figma template, I
realized that I wanted to use `webp` images in the code right away. In Figma files, images can be copied as `png`,
`svg`, or code. Thus, already at the beginning of the work, I wanted to have `webp` files on hand.

`Webp` is a lighter format than `jpg` and `png` and already has good browser support. In addition, it helped me
immediately understand the application's loading speed, see places requiring optimization, and estimate the final weight
of the build.

The application was on React, so I put all the source images in the `assets/images` folder so that they could be
imported from the code. By the way, I use the same approach in this blog in spite I use Svelte here.

I used Webpack, so already at the stage of assembling the application I would get errors related to the lack of
the same-name `webp` images. That is, before launching the application, I had to have them in the `assets/images`
folder, and then Webpack would copy them into the assembly.
I could use one of the image converters on the Internet to convert manually if there were few images. I did not like
this option and chose to use the `imagemin` and `imagemin-webp` libraries.
Installation:

```sh
npm install -D imagemin imagemin-webp
```

The documentation for `imagemin-webp` gives a similar example script, which is what I used:

```typescript
import imagemin from 'imagemin';
import webp from 'imagemin-webp';

await imagemin(['src/assets/images/`.{jpg,png}'], {
	destination: 'src/assets/images',
	plugins: [webp({ quality: 60 })],
});
```

I put this code in the `webp-images-generation.js` file. I needed to run this script before Webpack started building, so I
added `prestart` and `prebuild` scripts to `package.json`. These scripts run just before the `start` and `build` commands for
development and production, respectively.

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

Thus, when the `start` and `build` scripts are launched, the folder with images already contains of all the necessary
files.