<script lang="ts">
    import type { receiptTable } from "./db";

  const { item }: {item: receiptTable} = $props();
  const {lat, lon, image, note} = item;
  const created = new Date(item.created);

  const objUrl = URL.createObjectURL(image);
  console.log(objUrl);
  const jaJPCreated = Intl.DateTimeFormat(
    'ja-JP',
    {
      dateStyle: 'full',
      timeStyle: 'medium',
    }
  ).format(created);
</script>
<div>
  <time datetime="{created.toISOString()}">
    {jaJPCreated}
  </time>
  <span>緯度：{lat}</span>
  <span>経度：{lon}</span>
  <span>メモ：{note}</span>
  <img src="{objUrl}" />
</div>