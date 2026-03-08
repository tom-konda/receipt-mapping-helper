<script lang="ts">
  let { imageList }: {imageList: FileList|null} = $props();
  let dataURL = $state('');
  // imageListの変更を監視し、ファイルが選択されたらData URLに変換してプレビュー表示する。
  // readAsDataURLを使うのは、<img>のsrc属性にそのまま設定できるため。
  $effect(
    () => {
      const targetFile = imageList?.item(0);
      if (!targetFile) {
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(targetFile);
      reader.addEventListener(
        'loadend',
        (event) => {
          dataURL = reader.result as string
        }
      )
    }
  );
</script>

{#if dataURL}
  <figure>
    <figcaption>プレビュー</figcaption>
    <img alt="レシートのプレビュー" src="{dataURL}" />
  </figure>
{:else}
  <p>画像なし</p>
{/if}

<style>
  img {
    max-width: 100%;
    max-height: 50vh;
    object-fit: contain;
  }
</style>
