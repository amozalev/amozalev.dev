---
title: Batch PNG images conversion to WEBP in JS application.
description: How to develop a website layout from a Figma template instantly using WEBP instead of PNG.
datetime: 2025-06-09
image: cover.webp
ogImage: cover.png
tags:
  - javascript
  - node
---

![batch png conversion to webp](/images/posts/batch-png-conversion-to-webp/{image})
In one of the projects, in which I used a Figma template, I
realized that I wanted to use WEBP images in the code right away. In Figma files, images can be copied as PNG,
SVG, or code.

Why WEBP? WEBP is a contemporary, efficient, and lighter format than JPG and PNG, and it already has good browser
support. In
addition, it helped me
immediately understand the application's loading speed, see places requiring optimization, and estimate the final weight
of the build. For example, the size of the WEBP file in this post is 14 KB, while the same image, but in PNG is 815 KB.
The benefit is obvious &#129351.

The application was on React, so I put all the source PNG images in the `assets/images` folder so that they could be
imported from the code. There was a Webpack bundler in my app, and I needed to configure it to convert PNGs to WEBPs and
make automatic PNG import replacement. At that moment I didn't want to set up conversion via webpack, because it was
more
labor-intensive, but the goal was to concentrate on website layout. Therefore, I decided to use the following approach,
which is framework- and bundler-agnostic.

That is, before launching the application, I had to have WEBP images in the `assets/images`
folder, and then Webpack would copy them into the assembly.
I could use one of the image converters on the Internet to convert manually if there were few images. I did not like
this option and chose to use the `imagemin` and `imagemin-webp` libraries.
Installation:

```sh
npm install -D imagemin imagemin-webp
```

The documentation for `imagemin-webp` gives a similar example script, which is what I used. I put this code in the
`webp-images-generation.js` file.

```typescript
import imagemin from 'imagemin';
import webp from 'imagemin-webp';

await imagemin(['src/assets/images/`.{jpg,png}'], {
	destination: 'src/assets/images',
	plugins: [webp({ quality: 60 })],
});
```

I needed to run this script before Webpack started building, so
I added `prestart` and `prebuild` scripts to `package.json`. These scripts run just before the `start` and `build`
commands for development and production, respectively.

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

Thus, when the `start` or `build` scripts are launched, the folder with images already contains of all the necessary
WEBP
files.