<script lang="ts">
	import CalendarIcon from './icons/CalendarIcon.svelte';
	import type { PostModule } from '$lib/types/types';

	export let post: PostModule['metadata'];

	$: ({ title, datetime, description } = post);
</script>

<header>
	<h1>{title}</h1>
	<div class="date">
		<svelte:component this={CalendarIcon} />
		{datetime}
	</div>
	<div class="description">
		{description}
	</div>
</header>

<style>
    header {
        display: flex;
        flex-direction: column;
    }

    h1 {
        color: var(--color-accent);
        font-size: 24px;
        line-height: 150%;
    }

    .date {
        display: flex;
        align-items: center;
        gap: 8px;

        font-size: 14px;
        font-style: italic;
    }

    .description {
        margin-top: 32px;
    }
</style>