import type { PostModule } from '$lib/types/types';
import { formatDate } from '$lib/scripts/utils';
import { error } from '@sveltejs/kit';

export const loadPosts = () => {
	return import.meta.glob(`../content/posts/**/en.md`, { eager: true }) as Record<
		string,
		PostModule
	>;
};

export function fetchPosts() {
	const modules = loadPosts();

	return Object.entries(modules)
		.filter(([, file]) => !!file.metadata)
		.map(([path, file]) => {
			const meta = file.metadata;
			const slug = path.split('/').at(-2)?.split('.')[0] as string;

			const date = formatDate(meta.datetime);

			meta.tags ??= [];
			meta.materials ??= [];

			return { ...meta, slug, date };
		})
		.toSorted((a, b) => Date.parse(b.datetime) - Date.parse(a.datetime))
		.toSorted((a, b) => (a.pinned ? -1 : b.pinned ? 1 : 0));
}

export async function fetchPostContent({ slug }: { slug: string }) {
	try {
		const module: PostModule = await import(`../content/posts/${slug}/en.md`);
		const { metadata, default: content } = module;

		const datetime = formatDate(metadata.datetime);

		return {
			meta: { ...metadata, datetime, slug },
			content
		};
	} catch {
		error(404, `Page Not Found`);
	}
}

export async function fetchPageContent({ slug }: { slug: string }) {
	try {
		const module: PostModule = await import(`../content/pages/${slug}/en.md`);
		const { default: content } = module;

		return {
			meta: { slug },
			content
		};
	} catch {
		error(404, `Page Not Found`);
	}
}
