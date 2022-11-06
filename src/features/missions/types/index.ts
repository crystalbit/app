import { QUEST_TYPES } from '@features/missions/constants';

export type QuestType = typeof QUEST_TYPES.coding | typeof QUEST_TYPES.decrypt;
