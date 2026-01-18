import { fetchPosts } from '$lib/scripts/fileLoader';

export async function load() {
    const posts = fetchPosts();
    return { posts };
}
