<script lang="ts">
  import { db, type receiptTable } from "./db";

  const { item, ondelete }: {item: receiptTable, ondelete: () => void} = $props();
  const {image, note} = item;
  const created = new Date(item.created);

  let objUrl = $state('');

  // コンポーネント破棄時にObjectURLを解放してメモリリークを防ぐ
  $effect(() => {
    const url = URL.createObjectURL(image);
    objUrl = url;
    return () => {
      URL.revokeObjectURL(url);
    };
  });

  const handleDelete = async () => {
    if (!confirm('このデータを削除してもよろしいですか？')) {
      return;
    }
    try {
      await db.receipt_mapping.delete(item.id);
      ondelete();
    } catch (e) {
      console.error('データの削除に失敗しました', e);
      alert('データの削除に失敗しました。');
    }
  };

  const jaJPCreated = Intl.DateTimeFormat(
    'ja-JP',
    {
      dateStyle: 'full',
      timeStyle: 'medium',
    }
  ).format(created);
</script>
<div>
  <div class="item-header">
    <dl>
      <dt>登録日時</dt>
      <dd>
        <time datetime="{created.toISOString()}">
          {jaJPCreated}
        </time>
      </dd>
      {#if note}
        <dt>メモ</dt>
        <dd>{note}</dd>
      {/if}
    </dl>
    <button type="button" class="delete-button" onclick={handleDelete}>削除</button>
  </div>
  <img alt="{jaJPCreated}に登録された画像" src="{objUrl}" />
</div>

<style>
  div {
    padding: 0.5rem 0;
  }

  .item-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 0.75rem;
  }

  dl {
    margin: 0;
    text-align: left;
  }

  dt {
    font-size: 0.8em;
    color: #999;
    margin-top: 0.25rem;

    &:first-child {
      margin-top: 0;
    }
  }

  dd {
    margin: 0;
    font-size: 0.95em;
  }

  .delete-button {
    min-height: 44px;
    padding: 0.5rem 1.5rem;
    font-size: 0.9em;
    background-color: #8b2020;
    color: #fff;
    border: 1px solid #a02020;
    opacity: 0.8;
    flex-shrink: 0;

    &:hover {
      opacity: 1;
    }
  }

  img {
    width: 100%;
    height: auto;
    object-fit: contain;
    border-radius: 4px;

    @media (orientation: portrait) {
      max-height: 50vh;
    }
  }

  @media (prefers-color-scheme: light) {
    dt {
      color: #666;
    }

    .delete-button {
      background-color: #c0392b;
      border-color: #e74c3c;
    }
  }
</style>