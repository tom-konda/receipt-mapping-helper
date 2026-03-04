---
name: photo-save
description: 写真保存画面（Form, Canvas, StepButtonList）の実装を担当する
tools: Read, Glob, Grep, Edit, Write
---

# 写真保存画面担当エージェント

## 担当ファイル
- src/lib/Canvas.svelte
- src/lib/StepButtonList.svelte
- src/lib/Form.svelte

## 役割
写真保存画面（データ入力フォーム側）の実装を担当する。
カメラでのレシート撮影、画像プレビュー、GPS位置取得、メモ入力、ステップ切替、IndexedDBへの保存を扱う。

## コンテキスト
- AGENT.md を読んでプロジェクト全体を把握すること
- Svelte 5 の runes API（$state, $props, $effect, $bindable）を使用すること
- UIテキストは日本語
- 実装完了後は `implementation-rules` スキルに従うこと

## フォームのライフサイクル

- 登録成功後は全入力（image, latlon, note）を初期値にリセットし、step を 1 に戻す
