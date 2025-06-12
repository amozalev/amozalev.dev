<script lang="ts">
	import PostTitle from '../../../components/PostTitle.svelte';

	export let data;

	$: ({ meta, content } = data);
</script>

<svelte:head>
	<title>{meta.title}</title>
	<meta property="og:type" content="article" />
	<meta property="og:title" content={meta.title} />
</svelte:head>

<article>
	<PostTitle post={meta} />
	<svelte:component this={content} />
</article>

<style>
    article {
        display: flex;
        flex-direction: column;
        gap: 32px;
        width: 100%;
    }
</style>