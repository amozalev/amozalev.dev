<script>
	import { page } from '$app/state'
</script>

<div class="error_page">
	<h1 class="error">{page.status}</h1>
	<span class="icon">¯\_(ツ)_/¯</span>
	<p class="description">{page.error?.message}</p>
	<a class="go_back" href="/">Go back home</a>
</div>

<style>
    .error_page {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
    }

    .error {
        font-size: 128px;
        font-weight: bold;
        line-height: 128px;
        color: var(--color-accent);
    }

    .icon {
        font-size: 16px;
    }

    .description {
        font-size: 30px;
    }

    .go_back {
        font-size: 18px;
    }
</style>