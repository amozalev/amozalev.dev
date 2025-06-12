import { fetchPageContent } from '$lib/scripts/fileLoader';

export async function load() {
	return await fetchPageContent({ slug: 'home' });
}

export const trailingSlash = 'always';

export const prerender = true;
export const csr = false;