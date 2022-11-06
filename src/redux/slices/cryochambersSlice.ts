import { createSlice } from '@reduxjs/toolkit';

type InitialStateType = {
  chamberState: {
    isSet: boolean;
    energy: string;
  } | null;
  frozenItems: string[];
  xpBonuses: string[];
};

const initialState: InitialStateType = {
  chamberState: null,
  frozenItems: [],
  xpBonuses: []
};

const gameManagementReducer = createSlice({
  name: 'Cryochambers Handler',
  initialState,
  reducers: {
    setChambersState: (state, action) => {
      state.chamberState = action.payload;
    },
    setFrozenItems: (state, action) => {
      state.frozenItems = action.payload;
    },
    setXPBonuses: (state, action) => {
      state.xpBonuses = action.payload;
    }
  }
});

export const { setChambersState, setFrozenItems, setXPBonuses } =
  gameManagementReducer.actions;
export default gameManagementReducer.reducer;
