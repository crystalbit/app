import { createSlice } from '@reduxjs/toolkit';
import { NETWORK_DATA } from '@root/settings';

export interface AppPartsInterface {
  isConnectionPopupOpened: boolean;
  isMyLandShown: 'lands' | 'cart' | null;
  myLandsPageNumber: number;
  isLandMissionsAvailable: boolean;
  isPrivateAccount: boolean | null;
  isRevshareModalOpened: boolean;
  isGearPopupOpened: boolean;
}

const initialState: AppPartsInterface = {
  isConnectionPopupOpened: false,
  isMyLandShown: NETWORK_DATA.DEFAULT_ACCOUNT_STATE,
  myLandsPageNumber: 1,
  isLandMissionsAvailable: false,
  isPrivateAccount: null,
  isRevshareModalOpened: false,
  isGearPopupOpened: false
};

export const appPartsSlice = createSlice({
  name: 'App Parts Handler',
  initialState,
  reducers: {
    toggleConnectionPopup: (state, action) => {
      state.isConnectionPopupOpened = action.payload;
    },
    toggleMyLandPopup: (state, action) => {
      state.isMyLandShown = action.payload;
    },
    setLandPageNumber: (state, action) => {
      state.myLandsPageNumber = action.payload;
    },
    setLandMissionsAvailability: (state, action) => {
      state.isLandMissionsAvailable = !!action.payload;
    },
    setAccountPublicity: (state, action) => {
      state.isPrivateAccount = action.payload;
    },
    setRevshareModalState: (state, action) => {
      state.isRevshareModalOpened = action.payload;
    },
    toggleGearPopup: (state, action) => {
      state.isGearPopupOpened = action.payload;
    }
  }
});

export const {
  toggleConnectionPopup,
  toggleMyLandPopup,
  setLandPageNumber,
  setLandMissionsAvailability,
  setAccountPublicity,
  setRevshareModalState,
  toggleGearPopup
} = appPartsSlice.actions;

export default appPartsSlice.reducer;
