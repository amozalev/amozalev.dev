<script lang="ts">
	import { author } from '$lib/scripts/author';
	import type { PageMetaType } from '$lib/types';

	export let title: string;
	export let description: string = '';
	export let slug: string;
	export let ogImage: string = ``;

	export let type: PageMetaType = 'website';

	const { name, siteURL, siteName } = author;
	const url = `${siteURL}/${slug}`;
	const ogImageURL = `${siteURL}/images/posts/${slug}/${ogImage}`;
</script>

<svelte:head>
	<title>{title} | {siteName}</title>
	<meta name="description" content={description} />
	<meta name="author" content={name} />
	<meta name="robots" content="index, follow" />

	<!-- Open Graph -->
	<meta property="og:url" content={url} />
	<meta property="og:type" content={type} />
	<meta property="og:site_name" content={siteName} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	{#if ogImage}
		<meta property="og:image" content={ogImageURL} />
	{/if}

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="twitter:domain" content={author.siteURL}>
	<meta property="twitter:url" content={url}>
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	{#if ogImage}
		<meta name="twitter:image" content={ogImageURL} />
	{/if}

	<!-- Canonical -->
	<link rel="canonical" href={url} />
</svelte:head>
