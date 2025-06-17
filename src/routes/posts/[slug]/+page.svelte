<script lang="ts">
	import PostTitle from '../../../components/PostTitle.svelte';
	import MetaTags from '../../../components/MetaTags.svelte';

	export let data;

	$: ({ meta, content } = data);
</script>

<MetaTags title={meta.title} slug={meta.slug} description={meta.description ?? ''} type="article" />

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

    :where(h1) {
        margin-block: 0.67em;
        font-size: 2em;
    }
</style>