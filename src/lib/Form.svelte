<script lang="ts">
  import Canvas from './Canvas.svelte';
  import { db } from './db';
  let latlon = $state({lat: 0, lon: 0});
  let image: null|FileList = $state(null);
  let note: string = $state('');

  const setUploadFile = (event: Event) => {
    const inputElem = event.target as HTMLInputElement
    const fileList = inputElem.files;
    if (fileList) {
      image = fileList;
    }
  }

  const setCurrentCoordinate = () => {
    try {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          latlon.lat = position.coords.latitude;
          latlon.lon = position.coords.longitude;
        },
        (error) => {
          throw error;
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
        }
      )
    }
    catch(error) {
      if (error instanceof GeolocationPositionError) {
        console.error(error.code);
        console.error(error.message);
      }
    }
  }

  const setNoteContent = (event: FocusEvent) => {
    const textareaElement = event.target as HTMLTextAreaElement
    if (!textareaElement) {
      return;
    }
    note = textareaElement.value;
  }

  const getCurrentState = () => {
    console.log($state.snapshot(image)?.item(0)?.name, 'ファイル名');
    console.log($state.snapshot(latlon), '緯度経度');
    console.log($state.snapshot(note), 'メモ');
  }

  const loadImage = async (uploadImage: File) => {
    return new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(uploadImage);
      reader.addEventListener(
        'loadend',
        (event) => {
          resolve(reader.result as ArrayBuffer)
        }
      );

      reader.addEventListener(
        'error',
        (event) => {
          reject('File is not read correctly.')
        }
      );

      reader.addEventListener(
        'abort',
        (event) => {
          reject('File reading is aborted.')
        }
      );
    })
  }

  const insertData = async () => {
    try {
      const uploadImage = image?.item(0);
      console.log(uploadImage, 'アップデート');
      if (!uploadImage) {
        throw new Error('Upload image is not exist.');
      }

      const imageData = await loadImage(uploadImage);
      const blob = new Blob([imageData]);
      console.log([imageData, blob]);
      const id = await db.receipt_mapping.add({
        created: Date.now(),
        image: blob,
        lat: latlon.lat,
        lon: latlon.lon,
        note: note,
      })
    } catch (error) {
      console.error(error)
    }
  }
</script>

<section>
  <div id="step1">
    <h2>Step.1 レシートの画像を撮る</h2>
    <input type="file" capture accept="image/*" bind:files={image} onchange="{setUploadFile}"/>
    {#if image != null}
      <Canvas imageList={image} ></Canvas>
    {:else}
      <p>画像なし</p>
    {/if}
  </div>
  <div id="step2">
    <h2>Step.2 現在位置の取得</h2>
    <input type="button" value="GPSによって現在位置を取得する" onpointerdown="{setCurrentCoordinate}" />
    <p>現在位置は緯度{ latlon.lat }、経度{ latlon.lon }</p>
  </div>
  <div id="step3">
    <h2>Step.3 メモを取る</h2>
      <textarea onblur="{setNoteContent}"></textarea>
      <input type="button" value="登録する" onpointerdown="{insertData}" />
  </div>
</section>