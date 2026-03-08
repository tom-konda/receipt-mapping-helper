<script lang="ts">
  import { onMount } from 'svelte';
  import ListItem from './ListItem.svelte';
  import MapView from './MapView.svelte';
  import { db, type receiptTable } from "./db";
  let list: Array<receiptTable> = $state([]);
  let isOnline: boolean = $state(navigator.onLine);
  // ボタンタップ済みかどうかのフラグ（タップ後はボタンを非表示にする）
  let hasLoaded: boolean = $state(false);
  // カルーセルの現在表示インデックス
  let currentIndex: number = $state(0);
  // ListItemの再生成を強制するためのキー（削除後にcurrentIndexが変わらない場合でも再生成させる）
  let refreshKey: number = $state(0);

  onMount(() => {
    const handleOnline = () => { isOnline = true; };
    const handleOffline = () => { isOnline = false; };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  });

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
    // 全件削除された場合: インデックスをリセット
    if (list.length === 0) {
      currentIndex = 0;
    // 末尾のアイテムを削除した場合: はみ出すので末尾に補正
    } else if (prevIndex >= list.length) {
      currentIndex = list.length - 1;
    // それ以外: 同じ位置を維持（次のアイテムが繰り上がって表示される）
    } else {
      currentIndex = prevIndex;
    }
    refreshKey++;
  }
</script>
<section>
  <div>
    {#if !hasLoaded}
      <button type="button" onclick="{handleLoadButtonClick}" class="btn-primary">保存済みデータを表示</button>
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
      {#if isOnline}
        <MapView lat={list[currentIndex].lat} lon={list[currentIndex].lon} />
      {:else}
        <p class="offline-message">オフラインなので地図表示はありません</p>
      {/if}
      <div class="carousel-item">
        <!-- {#key}はキー値が変わるとコンポーネントを破棄・再生成する。
           削除後にcurrentIndexが同じ値のまま（末尾以外を削除した場合）でも
           ListItemを再生成してObjectURLの再作成を確実に行うため、refreshKeyを併用している -->
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
    gap: 0.75rem;
    max-width: 600px;
    margin: 0 auto;
  }

  .carousel-counter {
    font-size: 0.9em;
    color: #666;
    margin: 0;
    line-height: 48px;
  }

  .carousel-item {
    width: 100%;
  }

  .offline-message {
    text-align: center;
    color: #999;
    padding: 2rem 0;
  }

  .carousel-nav {
    display: flex;
    gap: 1rem;
    align-items: center;
    width: 100%;
    justify-content: center;

    button {
      padding: 0.75rem 1.5rem;
      font-size: 1em;
      min-height: 48px;
      min-width: 80px;
    }
  }
</style>
