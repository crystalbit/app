export enum LIST_FILTER_TYPE {
  all = 'all',
  lootboxes = 'lootboxes',
  gear = 'gears'
}

export type GearItemType = {
  category: string;
  durability: string;
  gearType: string;
  locked: boolean;
  rarity: string;
  src?: string;
  id: string;
};

export enum MINING_MAP_OBJECT {
  stone = -1,
  empty = 0,
  common_resource = 1,
  rare_resource = 2,
  legendary_resource = 3,
  worm = 4,
  obstacle = 5,
  gate = 6,
  fuel = 7,
  tunnel = 8
}

export type RepairVariantsTypes = '25' | '50' | '100';
