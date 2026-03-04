import Dexie, { type EntityTable } from 'dexie';

interface receiptTable {
  id: number,
  created: number,
  image: Blob,
  lat: number,
  lon: number,
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