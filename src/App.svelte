<script lang="ts">
  import Form from './lib/Form.svelte'
  import ListWrapper from './lib/ListWrapper.svelte'
  import ArrowIcon from './lib/icons/ArrowIcon.svelte'

  // 'top': 選択画面, 'save': 保存画面, 'load': 読み込み画面
  let page: 'top' | 'save' | 'load' = $state('top');
</script>

<main>
  {#if page === 'top'}
  <h1>Receipt mapping helper</h1>
  <section class="top-menu">
    <button type="button" class="btn btn-primary btn-top" onclick={() => page = 'save'}>写真を保存する</button>
    <button type="button" class="btn btn-primary btn-top" onclick={() => page = 'load'}>写真を読み込む</button>
    <a class="btn btn-top" href="https://github.com/tom-konda/receipt-mapping-helper?tab=readme-ov-file#receipt-mapping-helper" target="_blank" rel="noopener noreferrer">アプリの README を読む ↗</a>
  </section>
  {/if}

  {#if page === 'save'}
  <section>
    <button type="button" class="btn" onclick={() => page = 'top'}><ArrowIcon direction="up" /> トップに戻る</button>
    <Form />
  </section>
  {/if}

  {#if page === 'load'}
  <section>
    <button type="button" class="btn" onclick={() => page = 'top'}><ArrowIcon direction="up" /> トップに戻る</button>
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
  }

  /* TODO: save / load 画面の「トップに戻る」ボタンと本体 (Form / ListWrapper) の余白を整える */
</style>
