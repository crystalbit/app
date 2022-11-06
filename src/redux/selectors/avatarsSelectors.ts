import { RootState } from '@redux/store';

export const isAvatarsPopupOpened = (state: RootState) =>
  state.avatars.isFirstVisitFlow;

export const isAvatarsMinting = (state: RootState) =>
  state.avatars.isAvatarMinting;

export const isAvatarSaving = (state: RootState) =>
  state.avatars?.isAvatarSaving;

export const isAvatarSelectMode = (state: RootState) =>
  state.avatars?.isAvatarsSelectMode;

export const userAvatarsSelector = (state: RootState) =>
  state.avatars?.userAvatars;

export const filterUserAvatarsSelector = (state: RootState) =>
  state.avatars?.userFilterAvatars;

export const avatarsNamesSelector = (state: RootState) =>
  state.avatars?.avatarsNames;

export const isAvatarToEditSelector = (state: RootState) =>
  state.avatars?.avatarToEdit;

export const selectedAvatarSelector = (state: RootState) =>
  state.avatars.selectedAvatar;

export const avatarsExpSelector = (state: RootState) => state.avatars.avatarsXP;
