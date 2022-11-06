import { RootState } from '@redux/store';

export const lootboxPopupStateSelector = (state: RootState) =>
  state.lootboxes.isLootboxPopupActive;

export const lastMintedLootboxSelector = (state: RootState) =>
  state.lootboxes.lastOwnedLootbox;

export const userLootboxesListSelector = (state: RootState) =>
  state.lootboxes.lootboxesList;

export const userGearListSelector = (state: RootState) =>
  state.lootboxes.gearsList;

export const collectionItemToDisplaySelector = (state: RootState) =>
  state.lootboxes.collectionItemToDisplay;

export const clnyPriceSelector = (state: RootState) =>
  state.lootboxes.clnyPrice;

export const collectionLoader = (state: RootState) =>
  state.lootboxes.collectionLoader;
