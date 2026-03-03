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
  <ul>
    <li>
      <time datetime="{created.toISOString()}">
        {jaJPCreated}
      </time>
    </li>
    <li>メモ：{note}</li>
  </ul>
  <button type="button" class="delete-button" onclick={handleDelete}>削除</button>
  <img alt="{jaJPCreated}に登録された画像" src="{objUrl}" />
</div>

<style>
  div {
    padding: 0.5rem 0;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0 0 0.75rem 0;
  }

  ul li {
    padding: 0.25rem 0;
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
    margin-bottom: 0.75rem;
  }

  .delete-button:hover {
    opacity: 1;
  }

  img {
    width: 100%;
    height: auto;
    object-fit: contain;
    border-radius: 4px;
  }

  @media (orientation: portrait) {
    img {
      max-height: 50vh;
    }
  }

  @media (prefers-color-scheme: light) {
    .delete-button {
      background-color: #c0392b;
      border-color: #e74c3c;
    }
  }
</style>