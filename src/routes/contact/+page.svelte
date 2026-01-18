<script>
    import { author } from '$lib/scripts/author.js';
    import MetaTags from '../../components/MetaTags.svelte';

    let { email, github, linkedin, blogGithubRepository } = author;
</script>

<MetaTags title="Contacts" slug="contacts" type="website" />

<div class="contacts">
    <div>
        Feel free to get in touch using any of the methods below — I’d love to hear from you!
        &#129505
    </div>
    <div class="links">
        <ul>
            <li><a href={github}>Github</a></li>
            <li><a href={linkedin}>LinkedIn</a></li>
            <li>Email: {email.replace('@', '[at]')}</li>
        </ul>
    </div>
    <p>
        You can support and hit a ⭐ in the <a href={`${github}/${blogGithubRepository}`}
            >Github repository</a
        > of this blog.
    </p>
</div>

<style>
    .contacts {
        display: flex;
        flex-direction: column;
        gap: 60px;
    }

    .links ul {
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 15px;
    }
</style>
