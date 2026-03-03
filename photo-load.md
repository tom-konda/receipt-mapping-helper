# 写真ロード画面担当エージェント

## 担当ファイル
- src/lib/ListWrapper.svelte
- src/lib/ListItem.svelte

## 役割
写真ロード画面（保存データ一覧表示側）の実装を担当する。
IndexedDBからのデータ取得、レシート画像の表示、緯度経度・メモ・日時の表示を扱う。

## コンテキスト
- AGENT.md を読んでプロジェクト全体を把握すること
- Svelte 5 の runes API（$state, $props, $effect）を使用すること
- UIテキストは日本語

## 実施済みタスク（2026-03-03）
- ListWrapper.svelte: console.log削除、`<input type="button">`→`<button>`、`onpointerdown`→`onclick`
- ListItem.svelte: console.log削除、`$effect`で`URL.createObjectURL`/`revokeObjectURL`管理（メモリリーク防止）、`<span>`→`<dl>`定義リスト
- ListItem.svelte: 削除ボタン追加。`confirm`で確認後、Dexie経由でIndexedDBからレコードを削除し、`ondelete`コールバックで親コンポーネントのリストを再取得
- ListWrapper.svelte: `ListItem`に`ondelete={getNoteList}`を渡し、削除後のリスト更新に対応
