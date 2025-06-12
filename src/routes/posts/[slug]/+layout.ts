import { fetchPostContent } from '$lib/scripts/fileLoader';

export async function load({ params }) {
	const slug = params.slug;

	return await fetchPostContent({ slug });
}
