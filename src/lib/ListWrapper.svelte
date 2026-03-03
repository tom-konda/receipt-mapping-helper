<script lang="ts">
  import ListItem from './ListItem.svelte';
  import { db, type receiptTable } from "./db";
  let list: Array<receiptTable> = $state([]);
  // ボタンタップ済みかどうかのフラグ（タップ後はボタンを非表示にする）
  let hasLoaded: boolean = $state(false);

  const getNoteList = async () => {
    list = await db.receipt_mapping.orderBy('created').reverse().toArray();
    hasLoaded = true;
  }
</script>
<section>
  <div>
    {#if !hasLoaded}
      <button type="button" onclick="{getNoteList}">保存されているメモをリスト表示</button>
    {/if}
  </div>
  <div class="note-list">
    {#if hasLoaded && list.length === 0}
      <p>登録されているデータはありません。</p>
    {/if}
    {#each list as item }
      <ListItem item={item} />
    {/each}
  </div>
</section>
