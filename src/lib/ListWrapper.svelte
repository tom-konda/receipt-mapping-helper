<script lang="ts">
  import ListItem from './ListItem.svelte';
  import { db, type receiptTable } from "./db";
  let list: Array<receiptTable> = $state([]);
  // ボタンタップ済みかどうかのフラグ（タップ後はボタンを非表示にする）
  let hasLoaded: boolean = $state(false);
  // カルーセルの現在表示インデックス
  let currentIndex: number = $state(0);
  // ListItemの再生成を強制するためのキー（削除後にcurrentIndexが変わらない場合でも再生成させる）
  let refreshKey: number = $state(0);

  const fetchListFromDB = async () => {
    try {
      list = await db.receipt_mapping.orderBy('created').reverse().toArray();
      hasLoaded = true;
    } catch (e) {
      console.error('データの取得に失敗しました', e);
      alert('データの取得に失敗しました。ページを再読み込みしてください。');
    }
  }

  const handleLoadButtonClick = async () => {
    await fetchListFromDB();
    currentIndex = 0;
  }

  const prev = () => {
    currentIndex = currentIndex > 0 ? currentIndex - 1 : list.length - 1;
  }

  const next = () => {
    currentIndex = currentIndex < list.length - 1 ? currentIndex + 1 : 0;
  }

  const refreshListAfterDelete = async () => {
    const prevIndex = currentIndex;
    await fetchListFromDB();
    if (list.length === 0) {
      currentIndex = 0;
    } else if (prevIndex >= list.length) {
      currentIndex = list.length - 1;
    } else {
      currentIndex = prevIndex;
    }
    refreshKey++;
  }
</script>
<section>
  <div>
    {#if !hasLoaded}
      <button type="button" onclick="{handleLoadButtonClick}">保存されているメモをリスト表示</button>
    {/if}
  </div>
  {#if hasLoaded && list.length === 0}
    <p>登録されているデータはありません。</p>
  {/if}
  {#if hasLoaded && list.length > 0}
    <div class="carousel">
      <div class="carousel-nav">
        <button type="button" onclick={prev}>前へ</button>
        <span class="carousel-counter">{currentIndex + 1} / {list.length}</span>
        <button type="button" onclick={next}>次へ</button>
      </div>
      <div class="carousel-item">
        {#key `${currentIndex}-${refreshKey}`}
          <ListItem item={list[currentIndex]} ondelete={refreshListAfterDelete} />
        {/key}
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
