import { RootState } from '@redux/store';

export const isConnectionPopupSelector = (state: RootState) =>
  state.appParts.isConnectionPopupOpened;

export const isMyLandSelector = (state: RootState) =>
  state.appParts.isMyLandShown;

export const myLandPageSelector = (state: RootState) =>
  state.appParts.myLandsPageNumber;

export const isPrivateAddressSelector = (state: RootState) =>
  state.appParts.isPrivateAccount;

export const isRevShareModalSelector = (state: RootState) =>
  state.appParts.isRevshareModalOpened;

export const isGearModalSelector = (state: RootState) =>
  state.appParts.isGearPopupOpened;
