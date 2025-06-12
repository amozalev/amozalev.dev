<script lang="ts">
	export let icon;
	export let url: string;
	export let ariaLabel: string;
</script>

<a href={url} class="icon-btn" aria-label={ariaLabel}>
	<div class="icon-btn__inner">
		<svelte:component this={icon} />
	</div>
</a>

<style>
    .icon-btn {
        padding: 4px;
        border-radius: 4px;
        background: none;
        border: none;
        cursor: pointer;

        color: var(--color-text-base);

        &:hover {
            color: var(--color-accent);
        }
    }

    .icon-btn__inner {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 24px;
        height: 24px;
    }
</style>