<script lang="ts">
	import { page } from '$app/state';

	let path = page.url.pathname;
</script>

<header>
	<a class="home-link" href="/">Alex Mozalev</a>
	<nav>
		<ul class="menu">
			<li><a aria-current={path.startsWith('/posts')} href="/posts">Posts</a></li>
			<li><a aria-current={path.startsWith('/contact')} href="/contact">Contact</a></li>
		</ul>
	</nav>
</header>

<style>
    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 36px 0;
        border-bottom: 1px solid var(--color-border);
    }

    nav {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        gap: 20px;
    }

    .menu {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        gap: 20px;
        list-style: none;
    }

    .home-link {
        font-size: 24px;
        margin: 0;
        padding: 0;
    }

    a {
        text-decoration-line: none;
    }

    :is([aria-current='true']):not(.home-link) {
        text-decoration-line: underline;
        text-underline-offset: 4px;
        text-decoration-style: wavy;
    }
</style>