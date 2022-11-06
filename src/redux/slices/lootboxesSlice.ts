import { CollectionItemsType } from '@features/lootboxes/types';
import { GearItemType } from '@features/play/types';
import { createSlice } from '@reduxjs/toolkit';

type LootboxesReducerType = {
  isLootboxPopupActive: boolean;
  lastOwnedLootbox: null | string;
  lootboxesList: [string[], string[]];
  gearsList: [string[], GearItemType[]];
  collectionItemToDisplay: {
    type: CollectionItemsType | '';
    id: string;
    rarity: string | null;
  };
  clnyPrice: {
    valid: boolean;
    rate: number;
  } | null;
  collectionLoader: boolean;
};

const initialState: LootboxesReducerType = {
  isLootboxPopupActive: false,
  lastOwnedLootbox: null,
  lootboxesList: [[], []],
  gearsList: [[], []],
  collectionItemToDisplay: { type: '', id: '', rarity: '' },
  clnyPrice: null,
  collectionLoader: false
};

const lootboxesReducer = createSlice({
  name: 'lootboxes',
  initialState,
  reducers: {
    toggleLootboxPopup: (state, action) => {
      state.isLootboxPopupActive = action.payload;
    },
    setLastOwnedLootbox: (state, action) => {
      state.lastOwnedLootbox = action.payload;
    },
    setLootboxesList: (state, action) => {
      state.lootboxesList = action.payload;
    },
    setGearsList: (state, action) => {
      state.gearsList = action.payload;
    },
    selectCollectionItemToDisplay: (state, action) => {
      state.collectionItemToDisplay = action.payload;
    },
    setClnyPrice: (state, action) => {
      state.clnyPrice = action.payload;
    },
    setCollectionLoader: (state, action) => {
      state.collectionLoader = action.payload;
    }
  }
});

export const {
  toggleLootboxPopup,
  setLastOwnedLootbox,
  setLootboxesList,
  setGearsList,
  selectCollectionItemToDisplay,
  setClnyPrice,
  setCollectionLoader
} = lootboxesReducer.actions;

export default lootboxesReducer.reducer;
