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

db.version(1).stores({
  receipt_mapping: '++id, created, image, lat, lon, note'
});

export { db }
export type { receiptTable }