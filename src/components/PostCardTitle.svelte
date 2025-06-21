<script lang="ts">
	import CalendarIcon from './icons/CalendarIcon.svelte';
	import type { PostModule } from '$lib/types';
	import { formatDate } from '$lib/scripts/utils';

	export let post: PostModule['metadata'];

	$: ({ slug, title, datetime, description } = post);
</script>

<section>
	<h2><a href="{slug}">{title}</a></h2>
	<div class="date">
		<svelte:component this={CalendarIcon} />
		{formatDate(datetime)}
	</div>
	<div class="description">
		{description}
	</div>
</section>

<style>
    section {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    h2 {
        color: var(--color-accent);
        font-size: 18px;
        line-height: 150%;
    }

    a {
        text-decoration: none;

        &:hover {
            text-decoration: underline;
            text-decoration-style: dashed;
        }
    }

    .date {
        display: flex;
        align-items: center;
        gap: 8px;

        font-size: 14px;
        font-style: italic;
    }
</style>