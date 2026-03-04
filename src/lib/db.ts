import Dexie, { type EntityTable } from 'dexie';

/**
 * IndexedDB に保存するレシートデータの構造
 */
interface receiptTable {
  /** 自動採番の主キー */
  id: number,
  /** 撮影日時（Unix タイムスタンプ、ミリ秒）。ユニーク制約あり */
  created: number,
  /** レシート写真の Blob データ（JPEG、リサイズ済み） */
  image: Blob,
  /** 撮影場所の緯度 */
  lat: number,
  /** 撮影場所の経度 */
  lon: number,
  /** 自由記述のメモ */
  note: string,
}

const db = new Dexie('receipt_mapping') as Dexie & {
  receipt_mapping: EntityTable<
    receiptTable,
    'id'
  >,

};

db.version(3).stores({
  // &created: ユニーク制約。同一タイムスタンプのレシートが重複登録されるのを防ぐ。
  // また created をインデックス化することで、orderBy('created') による日時順ソートを高速にする。
  receipt_mapping: '++id, &created'
});

export { db }
export type { receiptTable }