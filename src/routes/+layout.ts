import { fetchPageContent } from '$lib/scripts/fileLoader';

export async function load({ url }) {
	return {
		...(await fetchPageContent({ slug: 'home' })),
		url: url.pathname
	};
}

export const trailingSlash = 'always';

export const prerender = true;
export const csr = false;
