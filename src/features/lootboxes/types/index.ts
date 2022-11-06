export enum COLLECTION_ITEMS_TYPES {
  lootbox = 'lootbox',
  gear = 'gear'
}

export type CollectionItemsType =
  | COLLECTION_ITEMS_TYPES.gear
  | COLLECTION_ITEMS_TYPES.lootbox;
