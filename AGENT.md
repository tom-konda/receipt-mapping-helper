# Receipt Mapping Helper

## アプリ概要
現地でレシートの写真を撮り、GPS位置情報とメモをブラウザのIndexedDBに保存し、帰宅後にOSM（OpenStreetMap）マッピング時にレシートデータを参照するためのWebアプリ。

### 背景・課題
- 現地でのマッピングは時間的制約（友人との行動、駐車場利用など）により困難
- スマートフォンからの入力は難読漢字などで不便
- 後でマッピングしようとしても場所が思い出せない
- マッピング未実施のレシートが蓄積する

### ワークフロー
1. **現地**: レシート写真撮影 → GPS位置取得 → メモ記入 → IndexedDBに保存
2. **帰宅後**: 保存データを一覧表示 → 緯度経度・画像・メモを参照しながらOSMマッピング

## ビルド・実行
- `mise exec -- pnpm dev` で開発サーバー起動
- `mise exec -- pnpm build` でビルド（mise経由でNodeを使用）

## サブエージェント一覧
- **photo-save**: 写真保存画面（Form, Canvas, StepButtonList）の実装 → `.claude/agents/photo-save.md`
- **photo-load**: 写真ロード画面（ListWrapper, ListItem）の実装 → `.claude/agents/photo-load.md`
- **senior-engineer**: 品質レビュー＆修正オーケストレーター → `.claude/agents/senior-engineer.md`
- **top-page**: トップページ（App.svelte）および新規コンポーネントの実装 → `.claude/agents/top-page.md`
- **ui-design**: UI/デザイン改善 → `.claude/agents/ui-design.md`（定義未作成）

## サブエージェント運用の教訓
- サブエージェントにファイル編集を依頼する場合、権限が拒否される可能性を想定しておく
- サブエージェントの出力は変更内容の仕様書として活用し、親エージェントが適用するフローが確実

## 参考資料
- プレゼン資料: https://www.docswell.com/s/tom-konda/5N1GY7-foss4g-hokkaido-LT-receipt-mapping
- リポジトリ: https://github.com/tom-konda/receipt-mapping-helper
