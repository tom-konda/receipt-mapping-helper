# Receipt Mapping Helper

OpenStreetMap (OSM) でレシート情報からマッピングしようとするときに発生する諸問題を改善するために作成したウェブアプリです。以下の機能を持ちます。

1. レシートの写真を GPS の緯度経度、撮影時間と紐付けて保存
  - 任意で簡単なメモも紐付けることが可能
2. 保存したレシートの写真を読み込んで、OSM のマッピング時の参考資料にすることが可能
  - OSM のマッピングが終わったら、写真の削除も可能

# デモ

https://tom-konda.github.io/receipt-mapping-helper/

# ライセンス

ライセンスは GPL2+ です。 \
なお、作成したコードの一部は生成 AI のコードを使用しています。

将来 AI によるコード生成の使用に関して重大な法的な判断が場合、
コミット ID `e3947789a1728b8331350864c897e9b253124a3f` まで、戻してから開発を再開します。

# FAQ

- Q. 保存した写真は外部のサービスに保存されるのですか？
  - A. いいえ。お使いのウェブブラウザが標準機能として持つデータベース内に保存されます。
- Q. レシートの写真以外にも使えますか？
  - A. はい。標識や看板など、現地で写真を撮って緯度経度を紐付けて、OSM にマッピングしたい対象なら問題なく使えます。

# 発表

- FOSS4G Hokkaido 2024 懇親会 LT: https://www.docswell.com/s/tom-konda/5N1GY7-foss4g-hokkaido-LT-receipt-mapping
- Maplibre Meetup Japan #04 : https://www.docswell.com/s/tom-konda/59V72Y-mug-jp_4-receipt-mapping