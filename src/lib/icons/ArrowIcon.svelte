<script lang="ts">
  type directionValue = 'left' | 'right' | 'up'
  // direction に応じて chevron の向きを切り替える矢印アイコンコンポーネント
  let { direction = 'left' }: { direction: directionValue } = $props();

  // 各方向に対応する chevron パス（24x24 viewBox 基準）
  const paths: Record<directionValue, string> = {
    left: 'M15 18l-6-6 6-6',
    right: 'M9 18l6-6-6-6',
    up: 'M18 15l-6-6-6 6',
  };
</script>

<!-- aria-hidden="true": ボタンのテキストラベルで意味が伝わるため、アイコン自体はスクリーンリーダーに読み上げさせない -->
<svg
  aria-hidden="true"
  style="vertical-align: middle"
  width="1em"
  height="1em"
  viewBox="0 0 24 24"
  stroke="currentColor"
  fill="none"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d={paths[direction]} />
</svg>
