<script lang="ts">
	import PostCard from './PostCard.svelte';
	import { type PostModule } from '$lib/types/types';

	export let posts: PostModule['metadata'][];
</script>

<div class="posts">
	{#each posts as post, idx}
		<PostCard {post} />
	{/each}
</div>

<style>
	.posts {
			display: flex;
			flex-direction: column;
			flex-grow: 1;
			gap: 24px;
	}
</style>