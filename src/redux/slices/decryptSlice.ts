import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type InitialStateType = {
  userAttempts: number;
  backendData: { success?: boolean; words: string[] } | null;
  history: [string, string][];
};

const initialState: InitialStateType = {
  userAttempts: 4,
  backendData: null,
  history: []
};

const decryptReducer = createSlice({
  name: 'Decrypt Handler',
  initialState,
  reducers: {
    setUserAttempts: (state, action) => {
      state.userAttempts = action.payload;
    },
    setDecryptSessionData: (
      state,
      action: PayloadAction<{ success?: boolean; words: string[] } | null>
    ) => {
      state.backendData = action.payload;
    },
    addHistoryRecord: (state, action: PayloadAction<[string, string]>) => {
      state.history.push(action.payload);
    },
    resetHistoryRecord: (state) => {
      state.history = [];
    }
  }
});

export const {
  setUserAttempts,
  setDecryptSessionData,
  addHistoryRecord,
  resetHistoryRecord
} = decryptReducer.actions;

export default decryptReducer.reducer;
