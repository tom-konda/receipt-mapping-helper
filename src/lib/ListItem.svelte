<script lang="ts">
  import { db, type receiptTable } from "./db";

  const { item, ondelete }: {item: receiptTable, ondelete: () => void} = $props();
  const {lat, lon, image, note} = item;
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
    <li>緯度：{lat}</li>
    <li>経度：{lon}</li>
  </ul>
  <button type="button" onclick={handleDelete}>削除</button>
  <img alt="{jaJPCreated}に登録された画像" src="{objUrl}" />
</div>