<script lang="ts">
  import Form from './lib/Form.svelte'
  import ListWrapper from './lib/ListWrapper.svelte'

  // 'top': 選択画面, 'save': 保存画面, 'load': 読み込み画面
  let page: 'top' | 'save' | 'load' = $state('top');
</script>

<main>
  {#if page === 'top'}
  <h1>Receipt mapping helper</h1>
  <section class="top-menu">
    <button type="button" class="btn-primary" onclick={() => page = 'save'}>写真を保存する</button>
    <button type="button" class="btn-primary" onclick={() => page = 'load'}>写真を読み込む</button>
  </section>
  {/if}

  {#if page === 'save'}
  <section>
    <button type="button" onclick={() => page = 'top'}>トップに戻る</button>
    <Form />
  </section>
  {/if}

  {#if page === 'load'}
  <section>
    <button type="button" onclick={() => page = 'top'}>トップに戻る</button>
    <ListWrapper />
  </section>
  {/if}
</main>

<style>
  .top-menu {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 480px;
    margin: 2rem auto;

    button {
      padding: 1rem;
      font-size: 1.2em;
      min-height: 48px;
    }
  }
</style>
