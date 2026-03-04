---
name: photo
description: 写真保存・ロード画面の実装時に参照すべき注意事項
---

# 写真関連コンポーネント実装ガイド

写真保存画面（Form, Canvas, StepButtonList）と写真ロード画面（ListWrapper, ListItem）の実装時に守るべきルールです。

## 担当ファイルと責務

- **共通**: `src/lib/db.ts`（Dexie スキーマ定義）
- 保存側・ロード側の担当ファイルは各サブエージェント定義（`photo-save.md`, `photo-load.md`）を参照

## Svelte 5 runes ルール

- リアクティブな状態は `$state()` で定義する
- コンポーネント間の props は `$props()` で受け取る
- 親子間で双方向バインドが必要な props は `$bindable()` を使う
- 副作用（FileReader, URL.createObjectURL 等）は `$effect()` 内で行う

## 画像の取り扱い

- `File` オブジェクトを直接 IndexedDB に保存しない。Blob に変換してから保存すること
- 画像の MIME type は `accept="image/*"` で制限済み
- 一時 URL（`ObjectURL`, `DataURL`）を生成した場合は、不要になった時点でメモリを解放すること
- 保存側・表示側それぞれの詳細は各サブエージェント定義（`photo-save.md`, `photo-load.md`）を参照

## モバイル対応

- `<input type="file">` には `capture` 属性を付けてカメラを直接起動させる
- Geolocation API は `enableHighAccuracy: true` で高精度測位を行う

## データベース（Dexie）

- `created` フィールドはユニーク制約（`&created`）。`Date.now()` のミリ秒タイムスタンプを使用
- データ取得時は `orderBy('created').reverse()` で新しいレシートが上に来るようにする

## UIテキスト

- すべて日本語で記述する

## 実装時の運用ルール

### 1. サブエージェント定義の更新
今までの担当範囲にない新しい機能の実装を命じられた場合は、対応するサブエージェントの定義ファイルを更新し、新しい担当範囲を追記すること。
- 保存側: `.claude/agents/photo-save.md`
- ロード側: `.claude/agents/photo-load.md`
- 品質レビュー: `.claude/agents/senior-engineer.md`

### 2. ソースコードへのコメント
プロジェクトに配属された新人エンジニアが理解できるよう、コードの意図が自明でない箇所には日本語コメントを残すこと。コメントすべき箇所の例：
- なぜその API やオプションを選択したのか（設計判断の理由）
- ブラウザ互換性やモバイル対応のための回避策
- メモリ管理やリソース解放の意図
- コードから読み取れない業務的な背景

コメント不要な箇所：
- 変数名や関数名から明らかに分かること
- Svelte の基本的な構文
- import 文
