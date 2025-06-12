<script>
	export let src;
	export let alt;
</script>

<figure>
	<img {src} {alt} />
	<figcaption>{alt}</figcaption>
</figure>

<style>
	img {
			width: 100%;
			height: auto;
	}
</style>