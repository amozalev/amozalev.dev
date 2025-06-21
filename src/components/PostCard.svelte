<script lang="ts">
	import { type PostModule } from '$lib/types';
	import PostCardTitle from './PostCardTitle.svelte';

	export let post: PostModule['metadata'];
</script>

<div class="post-card">
	<PostCardTitle {post} />
</div>

<style>
    .post-card {
				/*TODO обрезать текст*/

        /*display: flex;*/
        /*flex-direction: column;*/
        /*gap: 6px;*/
    }
</style>