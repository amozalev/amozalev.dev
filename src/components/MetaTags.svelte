<script lang="ts">
	import { author } from '$lib/scripts/author';
	import type { PageMetaType } from '$lib/types/types';

	export let title: string;
	export let description: string = '';
	export let slug: string;
	export let image: string = '';

	export let type: PageMetaType = 'website';

	const { name, siteURL, siteName } = author;
	const url = `${siteURL}/${slug}`;
</script>

<svelte:head>
	<title>{title} | {siteName}</title>
	<meta name="description" content={description} />
	<meta name="author" content={name} />
	<meta name="robots" content="index, follow" />

	<!-- Open Graph -->
	<meta property="og:type" content={type} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	{#if image}
		<meta property="og:image" content={image} />
	{/if}
	<meta property="og:url" content={url} />
	<meta property="og:site_name" content={siteName} />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	{#if image}
		<meta name="twitter:image" content={image} />
	{/if}
	<!--	<meta name="twitter:site" content={twitterHandle} />-->

	<!-- Canonical -->
	<link rel="canonical" href={url} />
</svelte:head>
