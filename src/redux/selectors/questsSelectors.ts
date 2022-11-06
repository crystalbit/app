import { RootState } from '@redux/store';

const questStepSelector = (state: RootState) => state.quests.step;

const activeQuestSelector = (state: RootState) => state.quests.activeQuest;

const subScreenStepSelector = (state: RootState) => state.quests.subScreenStep;

const missionRewardsSelector = (state: RootState) => state.quests.rewards;

const leaveScreenSelector = (state: RootState) => state.quests.isLeaveScreen;

const backendDataSelector = (state: RootState) => state.quests.backendData;

const rewardsSelector = (state: RootState) => state.quests.specialRewards;

const isMiningPrepareScreenOpened = (state: RootState) =>
  state.quests.isMiningPrepareScreenOpened;

const personalRevshareSelector = (state: RootState) =>
  state.quests.personalRevshare;

const missionLandRevshareSelector = (state: RootState) =>
  state.quests.missionLandRevshare;

const equippedMiningGearSelector = (state: RootState) =>
  state.quests.selectedMiningGear;

const selectedVehicleSelector = (state: RootState) =>
  state.quests.selectedVehicle;

export {
  activeQuestSelector,
  backendDataSelector,
  equippedMiningGearSelector,
  isMiningPrepareScreenOpened,
  leaveScreenSelector,
  missionLandRevshareSelector,
  missionRewardsSelector,
  personalRevshareSelector,
  questStepSelector,
  rewardsSelector,
  selectedVehicleSelector,
  subScreenStepSelector
};
