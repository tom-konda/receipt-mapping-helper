<script lang="ts">
  import ListItem from './ListItem.svelte';
  import { db, type receiptTable } from "./db";
  let list: Array<receiptTable> = $state([]);
  // ボタンタップ済みかどうかのフラグ（タップ後はボタンを非表示にする）
  let hasLoaded: boolean = $state(false);
  // カルーセルの現在表示インデックス
  let currentIndex: number = $state(0);

  const getNoteList = async () => {
    try {
      list = await db.receipt_mapping.orderBy('created').reverse().toArray();
      currentIndex = 0;
      hasLoaded = true;
    } catch (e) {
      console.error('データの取得に失敗しました', e);
      alert('データの取得に失敗しました。ページを再読み込みしてください。');
    }
  }

  const prev = () => {
    if (currentIndex > 0) currentIndex--;
  }

  const next = () => {
    if (currentIndex < list.length - 1) currentIndex++;
  }
</script>
<section>
  <div>
    {#if !hasLoaded}
      <button type="button" onclick="{getNoteList}">保存されているメモをリスト表示</button>
    {/if}
  </div>
  {#if hasLoaded && list.length === 0}
    <p>登録されているデータはありません。</p>
  {/if}
  {#if hasLoaded && list.length > 0}
    <div class="carousel">
      <div class="carousel-item">
        {#key currentIndex}
          <ListItem item={list[currentIndex]} />
        {/key}
      </div>
      <div class="carousel-nav">
        <button type="button" onclick={prev} disabled={currentIndex === 0}>前へ</button>
        <span class="carousel-counter">{currentIndex + 1} / {list.length}</span>
        <button type="button" onclick={next} disabled={currentIndex === list.length - 1}>次へ</button>
      </div>
    </div>
  {/if}
</section>

<style>
  .carousel {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .carousel-counter {
    font-size: 0.9em;
    color: #666;
    margin: 0;
  }

  .carousel-item {
    width: 100%;
  }

  .carousel-nav {
    display: flex;
    gap: 1rem;
  }

  .carousel-nav button {
    padding: 0.5rem 1.5rem;
    font-size: 1em;
  }
</style>
