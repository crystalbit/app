import { RootState } from '@redux/store';

export const userGameManagerSelector = (state: RootState) =>
  state.common.gameManager;

export const cryoManagerSelector = (state: RootState) =>
  state.common.cryoManager;

export const avatarsManagerSelector = (state: RootState) =>
  state.common.avatarsManager;

export const replaceManagerSelector = (state: RootState) =>
  state.common.replaceManager;

export const missionsManagerSelector = (state: RootState) =>
  state.common.missionsManager;

export const lootboxesManagerSelector = (state: RootState) =>
  state.common.lootboxesManager;

export const lmManagerSelector = (state: RootState) =>
  state.common.liquidityMiningManager;

export const clnyManagerSelector = (state: RootState) =>
  state.common.clnyManager;

export const mcManagerSelector = (state: RootState) => state.common.mcManager;

export const slpManagerSelector = (state: RootState) => state.common.slpManager;

export const gearsSelector = (state: RootState) => state.common.gears;

export const oracleSelector = (state: RootState) => state.common.oracle;

export const isCollectingSelector = (state: RootState) =>
  state.common.isCollecting;

export const isLoadingTokensSelector = (state: RootState) =>
  state.common.isLoading?.tokensLoading ?? false;

export const isInitializedSelector = (state: RootState) =>
  state.common.isInitialized ?? false;

export const isConnecting = (state: RootState) => state.common.isConnected;

export const providerSelector = (state: RootState) => state.common.provider;
