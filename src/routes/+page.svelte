<script lang="ts">
	export let data;

	$: ({ content } = data);
</script>

<div class="home-page">
	<div class="photo">
		<picture>
			<source srcset="photos/me.webp" type="image/webp">
			<img src="photos/me.jpg" alt="I'm on the Banjska Stena">
		</picture>
	</div>
	<div class="about">
		<svelte:component this={content} />
	</div>
</div>

<style>
    .home-page {
        display: flex;
        flex-direction: column;
        gap: 25px;
    }

    .photo {
        display: flex;
        justify-content: center;
        width: 100%;
        flex: 0 1 400px;
    }

    picture {
        position: relative;
        padding: 0;
        margin: 0;

        &:before {
            display: block;
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            -moz-box-shadow: inset 0 0 6px 6px var(--color-fill);
            -webkit-box-shadow: inset 0 0 6px 6px var(--color-fill);
            box-shadow: inset 0 0 6px 6px var(--color-fill);
        }
    }

    img {
        width: 100%;
        height: auto;
        display: block;
    }

    .about {
        display: flex;
        flex-direction: column;
        flex: 1 1 400px;
    }

    @media (min-width: 550px) {
        .home-page {
            flex-direction: row;
        }
    }
</style>