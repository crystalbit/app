import { StartRouteResponseType } from '@api/miningQuestApi';
import { FLOW_STEPS, SUBSCREEN_STEPS } from '@features/missions/constants';
import { QuestType } from '@features/missions/types';
import { MINING_GAME_INFO_DEFAULT } from '@features/play/constants';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface QuestSliceInterface {
  step: string;
  activeQuest: QuestType | null;
  subScreenStep: string;
  questsListItem: number;
  rewards: { name: string; value: string; type: string }[];
  answerSignature: { message: string; signature: string } | null;
  isLeaveScreen: boolean;
  backendData: { message: string; signature: string; address: string } | null;
  specialRewards: number;
  personalRevshare: string | null;
  missionLandRevshare: Array<string>;
  isMiningPrepareScreenOpened: boolean;
  transportCondition: number;
  selectedMiningGear: {
    drills: { src: string; rarity: string; id: string } | null;
    scanners: { src: string; rarity: string; id: string } | null;
    engines: { src: string; rarity: string; id: string } | null;
    transmitters: { src: string; rarity: string; id: string } | null;
  };
  selectedVehicle: 'common' | 'legendary';
  miningGameInfo: StartRouteResponseType;
  miningReward: {
    xp: {
      name: string;
      value: string;
      type: string;
    };
    clny: {
      name: string;
      value: string;
      type: string;
    };
    message: string;
    signature: string;
  } | null;
}

const initialState: QuestSliceInterface = {
  step: FLOW_STEPS.selectScreen,
  subScreenStep: SUBSCREEN_STEPS.preparing,
  activeQuest: null,
  questsListItem: 0,
  rewards: [],
  answerSignature: null,
  isLeaveScreen: false,
  backendData: null,
  specialRewards: 0,
  personalRevshare: null,
  missionLandRevshare: [],
  isMiningPrepareScreenOpened: false,
  selectedMiningGear: {
    drills: null,
    scanners: null,
    engines: null,
    transmitters: null
  },
  selectedVehicle: 'common',
  miningGameInfo: MINING_GAME_INFO_DEFAULT,
  miningReward: null,
  transportCondition: 0
};

export const questSlice = createSlice({
  name: 'Quest handler',
  initialState,
  reducers: {
    changeQuestStep: (state, action) => {
      state.step = action.payload;
    },
    changeSubScreenStep: (state, action) => {
      state.subScreenStep = action.payload;
    },
    setActiveQuest: (state, action) => {
      state.activeQuest = action.payload;
    },
    setSelectedQuestItem: (state, action) => {
      state.questsListItem = action.payload;
    },
    setQuestsRewards: (state, action) => {
      state.rewards = action.payload;
    },
    setAnswerSignatureValue: (state, action) => {
      state.answerSignature = action.payload;
    },
    setLeaveScreen: (state, action) => {
      state.isLeaveScreen = action.payload;
    },
    setBackendData: (state, action) => {
      state.backendData = action.payload;
    },
    setPersonalRevshare: (state, action) => {
      state.personalRevshare = action.payload;
    },
    setMissionLandRevshare: (state, action) => {
      state.missionLandRevshare = action.payload;
    },
    toggleMiningPrepareScreenState: (state, action) => {
      state.isMiningPrepareScreenOpened = action.payload;
    },
    equipMiningGear: (
      state,
      action: PayloadAction<{
        category: 'drills' | 'scanners' | 'transmitters' | 'engines';
        item: any;
        withReplace?: boolean;
      }>
    ) => {
      const { category, item, withReplace } = action.payload;

      if (state.selectedMiningGear[category]?.src === item?.src && withReplace)
        state.selectedMiningGear[category] = null;
      else {
        state.selectedMiningGear[category] = item;
      }
    },
    resetEquippedGear: (state) => {
      state.selectedMiningGear = {
        drills: null,
        scanners: null,
        engines: null,
        transmitters: null
      };
    },
    resetMiningGameInfo: (state) => {
      state.miningGameInfo = MINING_GAME_INFO_DEFAULT;
    },
    setMiningGameInfo: (
      state,
      action: PayloadAction<Partial<StartRouteResponseType>>
    ) => {
      state.miningGameInfo = {
        ...state.miningGameInfo,
        ...action.payload
      };
    },
    setMiningGameRewards: (
      state,
      action: PayloadAction<{
        xp: {
          name: string;
          value: string;
          type: string;
        };
        clny: {
          name: string;
          value: string;
          type: string;
        };
        message: string;
        signature: string;
      } | null>
    ) => {
      state.miningReward = action.payload;
    },
    setActualTransportState: (state, action: PayloadAction<number>) => {
      state.transportCondition = action.payload;
    }
  }
});

export const {
  changeQuestStep,
  setActiveQuest,
  changeSubScreenStep,
  setSelectedQuestItem,
  setQuestsRewards,
  setAnswerSignatureValue,
  setLeaveScreen,
  setBackendData,
  setPersonalRevshare,
  setMissionLandRevshare,
  toggleMiningPrepareScreenState,
  equipMiningGear,
  resetEquippedGear,
  setMiningGameInfo,
  setMiningGameRewards,
  setActualTransportState
} = questSlice.actions;

export default questSlice.reducer;
