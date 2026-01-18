<script>
    import GithubIcon from './icons/GithubIcon.svelte';
    import LinkedinIcon from './icons/LinkedinIcon.svelte';
    import IconLink from './IconLink.svelte';
    import { author } from '$lib/scripts/author.js';

    let { github, linkedin } = author;
</script>

<div class="social-networks">
    <IconLink icon={GithubIcon} url={github} ariaLabel="Github profile" />
    <IconLink icon={LinkedinIcon} url={linkedin} ariaLabel="LinkedIn profile" />
</div>

<style>
    .social-networks {
        display: flex;
        gap: 8px;
    }
</style>
