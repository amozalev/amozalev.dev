<script lang="ts">
	import MetaTags from '../components/MetaTags.svelte';

	export let data;

	$: ({ content } = data);
</script>

<MetaTags title="Hi!" slug="" type="website" />

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
    }

    @media (min-width: 550px) {
        .home-page {
            flex-direction: row;
        }

        .photo {
            justify-content: left;
        }

        .about {
            flex: 1 1 400px;
        }
    }
</style>