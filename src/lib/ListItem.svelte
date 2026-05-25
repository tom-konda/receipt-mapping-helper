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
    <button type="button" class="btn btn-danger item-header-delete-btn" onclick={handleDelete}>削除</button>
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
  </div>
  <img alt="{jaJPCreated}に登録された画像" src="{objUrl}" />
</div>

<style>
  div {
    padding: 0.25rem 0;
  }

  .item-header {
    margin-bottom: 0.375rem;

    /* float の子要素を含むためのクリアフィックス */
    &::after {
      content: '';
      display: block;
      clear: both;
    }
  }

  .item-header-delete-btn {
    float: right;
    margin-left: 1rem;
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
  }
</style>