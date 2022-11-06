import { AVATAR_REDUCER_NAME } from '@avatars/constants';
import { AvatarMetaFilter, AvatarsMetaAttributeType } from '@avatars/types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export interface AvatarsInterface {
  isFirstVisitFlow: boolean;
  isAvatarMinting: boolean;
  selectedAvatar: string | null;
  isAvatarSaving: boolean;
  userAvatars: string[] | null;
  userFilterAvatars: AvatarMetaFilter[];
  avatarsNames: string[] | null;
  isAvatarsSelectMode: boolean;
  avatarToEdit?: string;
  avatarsXP: Record<string, any> | null;
  status: string | null;
  error: string | null;
}

const initialState: AvatarsInterface = {
  isFirstVisitFlow: false,
  isAvatarMinting: false,
  selectedAvatar: localStorage.getItem('selectedAvatar') ?? '',
  isAvatarSaving: false,
  userAvatars: null,
  userFilterAvatars: [],
  avatarsNames: null,
  isAvatarsSelectMode: false,
  avatarToEdit: '',
  avatarsXP: null,
  status: null,
  error: null
};

export const fetchAvatarsData = createAsyncThunk(
  'Avatars/fetchAvatarsData',
  async (params: {
    link: string;
    selectedOptions: string;
    filterKey: string;
  }) => {
    const { link, selectedOptions, filterKey } = params;
    const response = await fetch(link);
    const data = await response.json();
    let arr: AvatarMetaFilter[] = [];

    data.forEach((item: AvatarMetaFilter) => {
      item.data.attributes.forEach(
        (itemAttributes: AvatarsMetaAttributeType) => {
          if (
            itemAttributes.trait_type === filterKey &&
            itemAttributes.value === selectedOptions
          ) {
            arr.push(item);
          }
        }
      );
    });

    return arr;
  }
);

export const avatarsSlice = createSlice({
  name: AVATAR_REDUCER_NAME,
  initialState,
  reducers: {
    setFirstVisitFlow: (state, action) => {
      state.isFirstVisitFlow = action.payload;
    },
    setAvatarEdit: (state, action) => {
      state.avatarToEdit = action.payload;
    },
    setAvatarMinting: (state, action) => {
      state.isAvatarMinting = action.payload;
    },
    setSelectedAvatar: (state, action) => {
      state.selectedAvatar = action.payload;
    },
    setIsAvatarSaving: (state, action) => {
      state.isAvatarSaving = action.payload;
    },
    switchAvatarsSelectMode: (state, action) => {
      state.isAvatarsSelectMode = action.payload;
    },
    setUserAvatarsList: (state, action) => {
      state.userAvatars = action.payload;
    },
    setAvatarsNamesList: (state, action) => {
      state.avatarsNames = action.payload;
    },
    setAvatarsXPList: (state, action) => {
      state.avatarsXP = action.payload;
    },
    dropAvatarsInfo: (state) => {
      state = {
        isFirstVisitFlow: false,
        isAvatarMinting: false,
        selectedAvatar: '',
        isAvatarSaving: false,
        userAvatars: [],
        avatarsNames: [],
        userFilterAvatars: [],
        isAvatarsSelectMode: false,
        avatarToEdit: '',
        avatarsXP: null,
        status: null,
        error: null
      };
      localStorage.removeItem('selectedAvatar');
      return state;
    },
    closeAvatarPopup: (state) => {
      state.avatarToEdit = '';
      state.isFirstVisitFlow = false;
      state.isAvatarSaving = false;
      state.isAvatarMinting = false;
      state.isAvatarsSelectMode = false;
    }
  },
  extraReducers: {
    [fetchAvatarsData.pending.toString()]: (state) => {
      state.status = 'pending';
      state.error = null;
    },
    [fetchAvatarsData.fulfilled.toString()]: (state, action) => {
      state.status = 'fulfilled';
      state.userFilterAvatars = action.payload;
    }
  }
});

export const {
  setFirstVisitFlow,
  setAvatarMinting,
  setSelectedAvatar,
  setIsAvatarSaving,
  switchAvatarsSelectMode,
  setUserAvatarsList,
  setAvatarsNamesList,
  setAvatarEdit,
  dropAvatarsInfo,
  closeAvatarPopup,
  setAvatarsXPList
} = avatarsSlice.actions;

export default avatarsSlice.reducer;
