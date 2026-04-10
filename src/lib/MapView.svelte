<script lang="ts">
  import { onMount } from 'svelte';
  import maplibregl from 'maplibre-gl';
  import 'maplibre-gl/dist/maplibre-gl.css';

  // DB スキーマに合わせて lon を使用している。
  let { lat, lon }: { lat: number, lon: number } = $props();

  let mapContainer: HTMLElement;
  let map: maplibregl.Map | undefined;
  let marker: maplibregl.Marker | undefined;

  // onMount: DOM 描画後に1回だけ実行される。
  // mapContainer (bind:this) が確実に存在するタイミングで地図を初期化する。
  // return で返す関数はコンポーネント破棄時にクリーンアップとして実行される。
  onMount(() => {
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

    return () => {
      map?.remove();
    };
  });

  // $effect: props (lat, lon) が変化するたびに実行される。
  // onMount より先に実行される可能性があるため、map/marker が初期化済みかをチェックする。
  $effect(() => {
    if (!map || !marker) return;
    map.setCenter({lon, lat});
    marker.setLngLat({lon, lat});
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
