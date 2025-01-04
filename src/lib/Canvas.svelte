<script lang="ts">
  let { imageList }: {imageList: FileList|null} = $props();
  let dataURL = $state('');
  $effect(
    () => {
      console.log(imageList?.item(0), '子コンポーネントの画像');
      const targetFile = imageList?.item(0);
      if (!targetFile) {
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(targetFile);
      reader.addEventListener(
        'loadend',
        (event) => {
          console.log(reader.result as string, 'データURL');
          dataURL = reader.result as string
        }
      )
    }
  );
</script>

{#if imageList != null}
  { imageList.item(0)?.type }
{:else}
  <p>画像なし</p>
{/if}

{#if dataURL != null}
  {dataURL.substring(dataURL.length - 30)}
{/if}