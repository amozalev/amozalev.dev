<script context="module">
	export { default as img } from './Figure.svelte';
</script>

<section>
	<slot />
</section>

<style>
    section {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        width: 100%;
        height: 100%;
    }
</style>