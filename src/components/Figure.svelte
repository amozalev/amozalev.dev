<script>
	export let src;
	export let alt;
	export let title;
</script>

<figure>
	<img {src} {alt} />
	<figcaption>{title}</figcaption>
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