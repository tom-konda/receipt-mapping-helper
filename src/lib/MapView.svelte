<script lang="ts">
  import { onMount } from 'svelte';
  import maplibregl from 'maplibre-gl';
  import 'maplibre-gl/dist/maplibre-gl.css';

  let { lat, lon }: { lat: number, lon: number } = $props();

  let mapContainer: HTMLDivElement;
  let map: maplibregl.Map | undefined;
  let marker: maplibregl.Marker | undefined;

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
      center: [lon, lat],
      zoom: 15,
    });

    marker = new maplibregl.Marker()
      .setLngLat([lon, lat])
      .addTo(map);

    return () => {
      map?.remove();
    };
  });

  $effect(() => {
    if (!map || !marker) return;
    map.setCenter([lon, lat]);
    marker.setLngLat([lon, lat]);
  });
</script>

<div class="map-container" bind:this={mapContainer}></div>

<style>
  .map-container {
    width: 100%;
    height: 50vw;
    min-height: 200px;
    max-height: 400px;
    border-radius: 4px;
  }
</style>
