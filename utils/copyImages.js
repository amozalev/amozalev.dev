import path from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import imagemin from 'imagemin';
import webp from 'imagemin-webp';
import imageminAvif from 'imagemin-avif';

async function convertImgToWebp(sourcePath, targetPath) {
	await imagemin([sourcePath], {
		destination: sourcePath,
		plugins: [webp({ quality: 60 })]
	});
}

async function convertImgToAvif(sourcePath, targetPath) {
	await imagemin([sourcePath], {
		destination: targetPath,
		plugins: [imageminAvif({ quality: 50 })]
	});
}

async function copyFiles(source, target) {
	const entries = await fs.readdir(source);

	for (const entry of entries) {
		const sourcePath = path.join(source, entry);
		const targetPath = path.join(target, entry);
		const stat = await fs.stat(sourcePath);

		if (stat.isDirectory()) {
			if (!existsSync(targetPath)) await fs.mkdir(targetPath);
			await copyFiles(sourcePath, targetPath);
		} else if (stat.isFile() && entry.match(/\.(jpg|png|webp|svg)$/i)) {
			if (entry.match(/\.(jpg|png)$/i)) {
				await convertImgToWebp(source, target);
				// await convertImgToAvif(sourcePath, target);
				// continue;
			}
			await fs.copyFile(sourcePath, targetPath);
		}
	}
}

(async function copyStatic() {
	const source = path.resolve('./src/lib/content');
	const target = path.resolve('./static/images');
	await copyFiles(source, target);

	const photoSource = path.resolve('./static/photos');
	const photoTarget = path.resolve('./static/photos');

	await copyFiles(photoSource, photoTarget);
})();
