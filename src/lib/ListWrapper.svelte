<script lang="ts">
  import ListItem from './ListItem.svelte';
  import { db, type receiptTable } from "./db";
  let list: Array<receiptTable> = $state([]);

  const getNoteList = async () => {
    list = await db.receipt_mapping.toArray();
    console.log(list);
  }
</script>
<section>
  <div>
    <input type="button" value="保存されているメモをリスト表示" onpointerdown="{getNoteList}" />
  </div>
  <div class="note-list">
    {#if list.length != 0}
      {#each list as item }
        <ListItem item={item} />
      {/each}
    {/if}
  </div>
</section>