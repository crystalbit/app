import { RootState } from '@redux/store';

const cryochambersStateSelector = (state: RootState) => state.cryo.chamberState;

const frozenAvasSelector = (state: RootState) => state.cryo.frozenItems;

const xpBonusesSelector = (state: RootState) => state.cryo.xpBonuses;

export { cryochambersStateSelector, frozenAvasSelector, xpBonusesSelector };
