<script lang="ts">
  import { onMount } from 'svelte';
  import type { Map, Marker } from 'maplibre-gl';

  // DB スキーマに合わせて lon を使用している。
  let { lat, lon }: { lat: number, lon: number } = $props();

  let mapContainer: HTMLElement;
  // Map/Marker はクラスインスタンスのため $state() でラップしない（Proxy化すると内部メソッドが壊れる）。
  // 代わりに initialized フラグで $effect のリアクティブ依存を確保する。
  let map: Map | undefined;
  let marker: Marker | undefined;
  let initialized = $state(false);

  // onMount: DOM 描画後に1回だけ実行される。
  // mapContainer (bind:this) が確実に存在するタイミングで地図を初期化する。
  // return で返す関数はコンポーネント破棄時にクリーンアップとして実行される。
  // async コールバックを直接渡すとクリーンアップ関数を返せないため、
  // 同期コールバック内で即時実行 async 関数を呼ぶ形にしている。
  onMount(() => {
    (async () => {
      const maplibregl = (await import('maplibre-gl')).default;
      await import('maplibre-gl/dist/maplibre-gl.css');

      map = new maplibregl.Map({
        container: mapContainer,
        style: {
          version: 8,
          sources: {
            osm: {
              type: 'raster',
              tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
              tileSize: 256,
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            },
          },
          layers: [
            {
              id: 'osm',
              type: 'raster',
              source: 'osm',
            },
          ],
        },
        center: {lon, lat},
        zoom: 16,
      });

      marker = new maplibregl.Marker()
        .setLngLat({lon, lat})
        .addTo(map);

      initialized = true;
    })();

    return () => {
      map?.remove();
    };
  });

  // $effect: props (lat, lon) が変化するたびに実行される。
  // lat, lon を先に読み出して依存関係に必ず登録されるようにする。
  // initialized ($state) で動的 import 完了後に再実行をトリガーする。
  $effect(() => {
    const currentLat = lat;
    const currentLon = lon;
    if (!initialized || !map || !marker) return;
    map.setCenter({lon: currentLon, lat: currentLat});
    marker.setLngLat({lon: currentLon, lat: currentLat});
  });
</script>

<figure class="map-container" bind:this={mapContainer}></figure>

<style>
  .map-container {
    width: 100%;
    height: 50vw;
    min-height: 200px;
    max-height: 400px;
    border-radius: 0;
    margin-left: 0;
    margin-right: 0;

    /* 縦向き時は高さが大きくなりすぎるため、通常時の max-height (400px) の 75% に制限する */
    @media (orientation: portrait) {
      max-height: 300px;
    }
  }
</style>
