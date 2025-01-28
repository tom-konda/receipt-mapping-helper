<script lang="ts">
  import Form from './lib/Form.svelte'
  import ListWrapper from './lib/ListWrapper.svelte'
</script>

<main>
  <div>
  </div>
  <h1>Receipt mapping helper</h1>

  <section class="app-main">
    <div class="form">
      <Form />
    </div>
    <div class="list">
      <ListWrapper />
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
