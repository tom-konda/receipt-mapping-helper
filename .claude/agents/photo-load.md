---
name: photo-load
description: 写真ロード画面（ListWrapper, ListItem）の実装を担当する
tools: Read, Glob, Grep, Edit, Write
---

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
- 実装完了後は `implementation-rules` スキルに従うこと

## 画像の表示

- `URL.createObjectURL()` で一時 URL を生成して `<img src>` に設定する
- コンポーネント破棄時に `URL.revokeObjectURL()` でメモリを解放すること（`$effect` のクリーンアップ関数を使う）

## データ削除

- `db.receipt_mapping.delete(id)` で IndexedDB からレコードを削除する
- 削除前に `confirm()` で確認ダイアログを表示する
- 削除後は親コンポーネントにコールバック（`ondelete`）で通知し、リストを再取得する
- 削除処理は `try/catch` でエラーハンドリングすること