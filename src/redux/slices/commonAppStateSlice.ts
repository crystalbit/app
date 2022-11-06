import { createSlice } from '@reduxjs/toolkit';
import { AbiItem } from 'web3-utils';
import { IProviderInfo } from 'web3modal';

export interface CommonAppState {
  provider: IProviderInfo | null;
  gameManager: any;
  avatarsManager: AbiItem[] | null;
  missionsManager: AbiItem[] | null;
  lootboxesManager: AbiItem[] | null;
  replaceManager: AbiItem[] | null;
  liquidityMiningManager: AbiItem[] | null;
  clnyManager: AbiItem[] | null;
  gears: AbiItem[] | null;
  mcManager: AbiItem[] | null;
  slpManager: AbiItem[] | null;
  cryoManager: AbiItem[] | null;
  oracle: AbiItem[] | null;
  isLoading: Record<string, boolean>;
  isConnected: boolean;
  isInitialized: boolean;
  isCollecting: boolean;
  isGameObjectFocused: boolean;
}

const initialState: CommonAppState = {
  provider: null,
  gameManager: null,
  avatarsManager: null,
  replaceManager: null,
  missionsManager: null,
  cryoManager: null,
  gears: null,
  liquidityMiningManager: null,
  clnyManager: null,
  mcManager: null,
  slpManager: null,
  lootboxesManager: null,
  oracle: null,
  isLoading: {
    tokensLoading: false
  },
  isConnected: false,
  isInitialized: false,
  isCollecting: false,
  isGameObjectFocused: false
};

export const commonStateSlice = createSlice({
  name: 'Common App State',
  initialState,
  reducers: {
    setGameManager: (state, action) => {
      state.gameManager = action.payload;
    },
    setCryoManager: (state, action) => {
      state.cryoManager = action.payload;
    },
    setGears: (state, action) => {
      state.gears = action.payload;
    },
    setOracle: (state, action) => {
      state.oracle = action.payload;
    },
    setAvatarManager: (state, action) => {
      state.avatarsManager = action.payload;
    },
    setReplaceManager: (state, action) => {
      state.replaceManager = action.payload;
    },
    setMissionsManager: (state, action) => {
      state.missionsManager = action.payload;
    },
    setlLiquidityMiningManager: (state, action) => {
      state.liquidityMiningManager = action.payload;
    },
    setCLNYManager: (state, action) => {
      state.clnyManager = action.payload;
    },
    setMCManager: (state, action) => {
      state.mcManager = action.payload;
    },
    setSLPManager: (state, action) => {
      state.slpManager = action.payload;
    },
    setLootboxesManager: (state, action) => {
      state.lootboxesManager = action.payload;
    },
    setUserProvider: (state, action) => {
      state.provider = action.payload;
    },
    resetInitializationOnDisconnect: (state) => {
      state.provider = null;
      state.isInitialized = false;
      state.isConnected = false;
    },
    setIsCollecting: (state, action) => {
      state.isCollecting = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading[action.payload?.field] = action.payload.value;
    },
    setInitialized: (state, action) => {
      state.isInitialized = action.payload;
    },
    setIsConnected: (state, action) => {
      state.isConnected = action.payload;
    },
    setFocusStatus: (state, action) => {
      state.isGameObjectFocused = action.payload;
    }
  }
});

export const {
  setGameManager,
  setAvatarManager,
  setReplaceManager,
  resetInitializationOnDisconnect,
  setIsCollecting,
  setIsLoading,
  setInitialized,
  setIsConnected,
  setUserProvider,
  setFocusStatus,
  setCryoManager,
  setMissionsManager,
  setLootboxesManager,
  setMCManager,
  setSLPManager,
  setlLiquidityMiningManager,
  setCLNYManager,
  setGears,
  setOracle
} = commonStateSlice.actions;

export default commonStateSlice.reducer;
