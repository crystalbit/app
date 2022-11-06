import { RootState } from '@redux/store';

export const UserAttemptsSelector = (state: RootState) =>
  state.decrypt.userAttempts;

export const DecryptDataSelector = (state: RootState) =>
  state.decrypt.backendData;

export const DecryptHistorySelector = (state: RootState) =>
  state.decrypt.history;
