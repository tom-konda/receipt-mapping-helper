# PWA 化 + MapView オンライン限定表示

## Context
このアプリ（レシート撮影 + GPS 記録）をオフラインでも使えるよう PWA 化する。
ただし地図タイル（OpenStreetMap）はオフラインで取得不可のため、MapLibre GL JS はオンライン時のみ動的 import して表示する。

## 変更対象ファイル

| ファイル | 変更内容 |
|---------|---------|
| `package.json` | `vite-plugin-pwa` を devDependencies に追加 |
| `vite.config.ts` | VitePWA プラグイン設定追加（manifest, service worker） |
| `index.html` | `theme-color` meta タグ追加 |
| `src/lib/MapView.svelte` | 動的 import 方式に変更 |
| `src/lib/ListWrapper.svelte` | オンライン状態監視 + MapView の条件付き表示 |
| `public/` | PWA アイコン画像追加（192x192, 512x512） |

## 実装ステップ

### 1. `vite-plugin-pwa` のインストール
```
pnpm add -D vite-plugin-pwa
```

### 2. `vite.config.ts` に PWA プラグイン追加
- `VitePWA` プラグインを追加
- manifest 設定: name, short_name, theme_color, icons 等
- `registerType: 'autoUpdate'` で自動更新
- Service Worker のキャッシュ戦略を設定（`generateSW` モード）
- MapLibre 関連の JS チャンクを precache 対象から除外する（`workbox.navigateFallbackDenylist` や `globPatterns` で制御）

### 3. `index.html` に meta タグ追加
- `<meta name="theme-color">` を追加

### 4. `src/lib/MapView.svelte` を動的 import 対応に変更
- `import maplibregl from 'maplibre-gl'` を静的 import から削除
- `onMount` 内で `const maplibregl = (await import('maplibre-gl')).default` を使用
- CSS も動的にロード: `await import('maplibre-gl/dist/maplibre-gl.css')`
- これにより MapLibre がメインバンドルから分離され、別チャンクになる

### 5. `src/lib/ListWrapper.svelte` にオンライン状態監視を追加
- `navigator.onLine` で初期状態を取得し `$state` で管理
- `onMount` で `online`/`offline` イベントリスナーを登録（`onDestroy` で解除）
- オンライン時: `<MapView>` を表示
- オフライン時: 「オフラインのため地図を表示できません」等の代替メッセージを表示

### 6. PWA アイコンの準備
- シンプルなプレースホルダーアイコン（SVG ベース）を `public/` に配置
- 192x192 と 512x512 の 2 サイズ

## 検証方法
1. `pnpm build && pnpm preview` でビルド後プレビュー
2. Chrome DevTools > Application タブで manifest と Service Worker が登録されていることを確認
3. DevTools > Network タブで「Offline」にチェック → アプリが動作し、地図部分のみ代替表示になることを確認
4. `pnpm check` で TypeScript エラーがないことを確認
