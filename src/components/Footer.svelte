<script>
	import SocialNetworks from './SocialNetworks.svelte';
</script>

<footer class="footer">
	<div class="author">
		<SocialNetworks />
		<span>Alex Mozalev © 2025</span>
	</div>
	<div class="licences">
		Content is distributed under license CC BY-NC-SA 4.0
	</div>
</footer>

<style>
    .footer {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
				gap: 16px;
        padding: 16px 36px;
        border-top: 1px solid var(--color-border);
    }

    .author {
        display: flex;
        justify-content: space-between;
    }

    .licences {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    @media (max-width: 650px) {
        .footer {
            flex-direction: column;
        }
    }


</style>