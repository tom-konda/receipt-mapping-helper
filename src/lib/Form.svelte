<script lang="ts">
  import Canvas from './Canvas.svelte';
  import StepButtonList from './StepButtonList.svelte';
  import { db } from './db';
  let latlon = $state({lat: 0, lon: 0});
  let image: null|FileList = $state(null);
  let note: string = $state('');
  let step = $state(1);
  // stepごとに「次へ」ボタンの有効/無効を制御する条件を算出
  const canAdvance = $derived(
    step === 1 ? image !== null
    : step === 2 ? (latlon.lat !== 0 || latlon.lon !== 0)
    : true
  );
  let dialogMessage: string = $state('');
  let dialogRef: HTMLDialogElement | undefined = $state(undefined);

  const showDialog = (message: string) => {
    dialogMessage = message;
    dialogRef?.showModal();
  };

  const setUploadFile = (event: Event) => {
    const inputElem = event.target as HTMLInputElement
    const fileList = inputElem.files;
    if (fileList) {
      image = fileList;
    }
  }

  const setCurrentCoordinate = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        latlon.lat = position.coords.latitude;
        latlon.lon = position.coords.longitude;
      },
      (error) => {
        // 非同期コールバックのため外側のtry-catchでは捕捉できない。直接ユーザーに通知する
        console.error(error.code, error.message);
        alert(`位置情報の取得に失敗しました: ${error.message}`);
      },
      {
        // GPS等の高精度な位置情報源を使用し、OSMマッピングに十分な精度を得る
        enableHighAccuracy: true,
        // 現地での利用を想定し、5秒以内に取得できなければエラーにして待たせすぎない
        timeout: 5000,
      }
    )
  }

  const setNoteContent = (event: FocusEvent) => {
    const textareaElement = event.target as HTMLTextAreaElement
    if (!textareaElement) {
      return;
    }
    note = textareaElement.value;
  }

  const MAX_LONG_SIDE = 1280;
  const JPEG_QUALITY = 0.7;

  // 方式D: createImageBitmapでリサイズし、CanvasからJPEG Blobを生成する。
  // ブラウザのネイティブリサイズを利用するため高速かつ省メモリ。
  //
  // --- 方式B（ステップダウンリサイズ）代替案 ---
  // 方式Dの resizeQuality オプションに未対応のブラウザでは、
  // レシートの文字がジャギー（ギザギザ）になる場合がある。
  // その場合は方式B（ステップダウンリサイズ）に切り替える。
  //
  // 方式Bの概要:
  //   50%ずつ段階的に縮小することで、バイリニア補間の品質低下を回避する手法。
  //
  // 方式Bの実装概要（擬似コード）:
  //   1. 元画像をCanvasに描画
  //   2. 現在サイズが目標サイズの2倍以上ある間:
  //      - 幅・高さを50%に縮小した別のCanvasに drawImage で描画
  //      - 縮小後のCanvasを「現在のCanvas」とする
  //   3. 最後に目標サイズのCanvasに drawImage で描画
  //   4. canvas.toBlob() でJPEG Blobを取得
  // ---
  const resizeImage = async (file: File): Promise<Blob> => {
    // 元画像のサイズを取得するため、まずリサイズなしでビットマップを作成
    const originalBitmap = await createImageBitmap(file);
    let resizeWidth: number;
    let resizeHeight: number;
    try {
      const { width, height } = originalBitmap;

      // 長辺が上限以下ならリサイズ不要。元画像をJPEGに変換するだけ
      if (width <= MAX_LONG_SIDE && height <= MAX_LONG_SIDE) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas 2D コンテキストの取得に失敗しました');
        ctx.drawImage(originalBitmap, 0, 0);
        return canvasToBlob(canvas);
      }

      // アスペクト比を維持しつつ長辺をMAX_LONG_SIDEに収める
      const scale = MAX_LONG_SIDE / Math.max(width, height);
      resizeWidth = Math.round(width * scale);
      resizeHeight = Math.round(height * scale);
    } finally {
      originalBitmap.close();
    }

    // originalBitmap は close 済みなので file から再度リサイズ付きで生成
    // createImageBitmapのresizeオプションで高品質リサイズを実行
    const resizedBitmap = await createImageBitmap(file, {
      resizeWidth,
      resizeHeight,
      resizeQuality: 'high',
    });
    try {
      const canvas = document.createElement('canvas');
      canvas.width = resizeWidth;
      canvas.height = resizeHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas 2D コンテキストの取得に失敗しました');
      ctx.drawImage(resizedBitmap, 0, 0);
      return canvasToBlob(canvas);
    } finally {
      resizedBitmap.close();
    }
  }

  // Canvas要素からJPEG Blobを生成するヘルパー
  const canvasToBlob = (canvas: HTMLCanvasElement): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Canvas to Blob conversion failed.'));
          }
        },
        'image/jpeg',
        JPEG_QUALITY,
      );
    });
  }

  const insertData = async () => {
    try {
      const uploadImage = image?.item(0);
      if (!uploadImage) {
        throw new Error('Upload image is not exist.');
      }

      // リサイズ済みJPEG BlobをIndexedDBに保存する
      const blob = await resizeImage(uploadImage);
      const id = await db.receipt_mapping.add({
        created: Date.now(),
        image: blob,
        lat: latlon.lat,
        lon: latlon.lon,
        note: note,
      })
      // 登録完了後、次のレシート撮影に備えて全入力をリセットする
      image = null;
      latlon = {lat: 0, lon: 0};
      note = '';
      step = 1;
      showDialog('保存しました');
    } catch (error) {
      console.error(error);
      showDialog('保存に失敗しました。もう一度お試しください。');
    }
  }
</script>

<section>
  {#if step === 1}
  <div id="step1">
    <h2>Step.1 レシートの画像を撮る</h2>
    <!-- 次へボタンをファイル選択の上に配置し、撮影後すぐに進めるようにする -->
    <StepButtonList bind:step={step} {canAdvance} />
    <!-- capture属性: モバイル端末でファイル選択ではなくカメラを直接起動させるために指定 -->
    <input type="file" capture accept="image/*" bind:files={image} onchange="{setUploadFile}"/>
    {#if image != null}
      <Canvas imageList={image} ></Canvas>
    {:else}
      <p>画像なし</p>
    {/if}
  </div>
  {/if}
  {#if step === 2}
  <div id="step2">
    <h2>Step.2 現在位置の取得</h2>
    <StepButtonList bind:step={step} {canAdvance} />
    <button type="button" onclick="{setCurrentCoordinate}">GPSによって現在位置を取得する</button>
    <p>現在位置は緯度{ latlon.lat }、経度{ latlon.lon }</p>
  </div>
  {/if}
  {#if step === 3}
  <div id="step3">
    <h2>Step.3 メモを取る</h2>
      <StepButtonList bind:step={step} {canAdvance} />
      <textarea onblur="{setNoteContent}"></textarea>
      <button type="button" onclick="{insertData}">登録する</button>
  </div>
  {/if}

  <!-- showModal()で表示するため、backdrop疑似要素による背景オーバーレイも自動で適用される -->
  <dialog bind:this={dialogRef}>
    <p>{dialogMessage}</p>
    <button type="button" onclick={() => dialogRef?.close()}>閉じる</button>
  </dialog>
</section>
