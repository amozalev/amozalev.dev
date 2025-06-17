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

    :where(article, aside, nav, section) h1 {
        font-size: 24px;
    }
</style>