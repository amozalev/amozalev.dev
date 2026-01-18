<script lang="ts">
    import '../app.css';
    import Header from '../components/Header.svelte';
    import Footer from '../components/Footer.svelte';
</script>

<div class="wrapper">
    <div class="container">
        <Header />
        <main>
            <slot />
        </main>
        <Footer />
    </div>
</div>

<style>
    .wrapper {
        display: flex;
        justify-content: center;
        width: 100%;
        min-height: 100%;
    }

    .container {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        justify-content: center;
        gap: 32px;
        width: 100%;
        max-width: 768px;
        padding: 0 16px;
    }

    main {
        display: flex;
        flex-grow: 1;
        flex-direction: column;
        gap: 20px;
        width: 100%;
        height: 100%;
    }
</style>
