<script lang="ts">
  import Form from './lib/Form.svelte'
</script>

<main>
  <div>
  </div>
  <h1>Vite + Svelte</h1>

  <section class="app-main">
    <div class="list">

    </div>
    <div class="form">
      <Form />
    </div>
  </section>

  <p>
    Check out <a href="https://github.com/sveltejs/kit#readme" target="_blank" rel="noreferrer">SvelteKit</a>, the official Svelte app framework powered by Vite!
  </p>

  <p class="read-the-docs">
    Click on the Vite and Svelte logos to learn more
  </p>
</main>

<style>
  .read-the-docs {
    color: #888;
  }

  .app-main {
    display: grid;
    grid-template-columns: 50% 50%;
  }
</style>
