<script lang="ts">
	import Posts from '../../components/Posts.svelte';
	import MetaTags from '../../components/MetaTags.svelte';

	export let data;
</script>

<MetaTags title="Posts" slug="posts" type="article" />

<Posts posts={data.posts} />
