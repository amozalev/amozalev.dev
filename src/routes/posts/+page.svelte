<script lang="ts">
	import Posts from '../../components/Posts.svelte';

	export let data;
</script>

<Posts posts={data.posts} />
