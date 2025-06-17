<script>
	export let src;
	export let alt;
</script>

<figure>
	<img {src} {alt} />
	<figcaption>{alt}</figcaption>
</figure>

<style>
    figure {
        margin: 0;
        padding: 0;
    }

    img {
        width: 100%;
        height: auto;
    }
</style>