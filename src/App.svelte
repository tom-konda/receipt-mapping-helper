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
    <button type="button" class="btn-primary" onclick={() => page = 'save'}>写真を保存する</button>
    <button type="button" class="btn-primary" onclick={() => page = 'load'}>写真を読み込む</button>
    <a href="https://github.com/tom-konda/receipt-mapping-helper?tab=readme-ov-file#receipt-mapping-helper" target="_blank" rel="noopener noreferrer">アプリのREADMEを読む ↗</a>
  </section>
  {/if}

  {#if page === 'save'}
  <section>
    <button type="button" onclick={() => page = 'top'}><ArrowIcon direction="up" /> トップに戻る</button>
    <Form />
  </section>
  {/if}

  {#if page === 'load'}
  <section>
    <button type="button" onclick={() => page = 'top'}><ArrowIcon direction="up" /> トップに戻る</button>
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

    /* ボタンと見た目を揃えつつ、セカンダリ的な配色で外部リンクであることを示す */
    a {
      padding: 1rem;
      font-size: 1.2em;
      min-height: 48px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      border: 2px solid rgba(255, 255, 255, 0.25);
      background-color: #1a1a1a;
      color: #9da2ff;
      font-weight: 500;
      cursor: pointer;
      transition: border-color 0.25s;
      text-decoration: none;
      box-sizing: border-box;

      &:hover {
        border-color: #9da2ff;
        color: #b4b8ff;
      }

      &:focus,
      &:focus-visible {
        outline: 4px auto -webkit-focus-ring-color;
      }
    }
  }

  /* ライトモード時のリンクボタン配色 */
  @media (prefers-color-scheme: light) {
    .top-menu a {
      background-color: #f9f9f9;
      border-color: rgba(0, 0, 0, 0.20);
      color: #3b40b0;

      &:hover {
        border-color: #3b40b0;
        color: #2e3290;
      }
    }
  }
</style>
