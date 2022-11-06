import { configureStore } from '@reduxjs/toolkit';
import appPartsReducer from '@slices/appPartsSlice';
import avatarsReducer from '@slices/avatarsSlice';
import cartReducer from '@slices/cartSlice';
import commonStateReducer from '@slices/commonAppStateSlice';
import cryoReducer from '@slices/cryochambersSlice';
import decryptReducer from '@slices/decryptSlice';
import gameManagementReducer from '@slices/gameManagementSlice';
import lootboxesReducer from '@slices/lootboxesSlice';
import questReducer from '@slices/questSlice';
import balanceStatsReducer from '@slices/userStatsSlice';

export const store = configureStore({
  reducer: {
    appParts: appPartsReducer,
    balanceStats: balanceStatsReducer,
    common: commonStateReducer,
    game: gameManagementReducer,
    avatars: avatarsReducer,
    quests: questReducer,
    cart: cartReducer,
    lootboxes: lootboxesReducer,
    cryo: cryoReducer,
    decrypt: decryptReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
