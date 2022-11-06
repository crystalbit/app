import { StartRouteResponseType } from '@api/miningQuestApi';
import { QUEST_TYPES } from '@features/missions/constants';
import { MINING_MAP_OBJECT, RepairVariantsTypes } from '@features/play/types';
import { WHITE } from '@global/styles/variables';
import { extractURLParam } from '@global/utils/urlParams';
import { NETWORK_DATA } from '@root/settings';

const MISSIONS_LIST = [
  {
    value: {
      name: 'Coding challenge',
      difficulty: 'Easy',
      reward: '0.75',
      profession: 'Programmer'
    },
    isActive: true,
    key: QUEST_TYPES.coding
  },
  {
    value: {
      name: 'Message decryption',
      difficulty: 'Medium',
      reward: '1',
      profession: 'Scientist'
    },
    isActive: true,
    key: QUEST_TYPES.decrypt
  },
  {
    value: {
      name: 'Mining mission',
      difficulty: 'Hard',
      reward: '1.5',
      profession: 'Miner'
    },
    key: QUEST_TYPES.mining,
    isActive: true,
    customAction: true
  }
];

const MISSIONS_BLOCK_TABS: {
  label: string;
  isActive: boolean;
}[] = [
  {
    label: 'Missions',
    isActive: NETWORK_DATA.MISSIONS
  },
  {
    label: 'Avatars',
    isActive: NETWORK_DATA.AVATARS
  },
  {
    label: 'Training center',
    isActive: NETWORK_DATA.CRYOCHAMBERS
  },
  {
    label: 'Storage',
    isActive: NETWORK_DATA.LOOTBOXES
  }
];

const MINING_PREPARE_MOBILE_BP = 1245;

const MINING_PREPARE_WIDTH = 1070;

const MINING_PREPARE_BORDER = `1px solid ${WHITE}`;

const GEAR_CATEGORIES = {
  engines: '0',
  drills: '1',
  scanners: '2',
  transmitters: '3',
  transports: '4'
};

const REPAIR_VARIANTS: RepairVariantsTypes[] = ['25', '50', '100'];

const SELECT_GEAR_BUTTON_ID = 'select-gear-confirm';

const TRANSPORT_DIRECTIONS = {
  left: 'left',
  right: 'right',
  up: 'up',
  down: 'down'
};

const MINING_GAME_INFO_DEFAULT: StartRouteResponseType = {
  position: { x: 0, y: 0 },
  moves: 0,
  dynamites: 0,
  scans: 0,
  tiles: [{ x: 0, y: 0, state: 0 }],
  resources: {
    common: 0,
    rare: 0,
    legendary: 0
  },
  fightStatus: 'fail',
  worm: false,
  data: []
};

const INITIAL_GAME_TIME = 1200;
const DEFAULT_WIDTH = 960;
const DEFAULT_HEIGHT = 800;
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 2400;
const TILE_SIZE = 160;

const MAX_MOVES_LIMIT = () => {
  // @ts-ignore
  const engineGear = extractURLParam(window.location, 'engines');
  // @ts-ignore
  const roverId = extractURLParam(window.location, 'transportId');

  if (!engineGear) return 125;

  let count;

  switch (engineGear) {
    case '0':
      count = 129;
      break;
    case '1':
      count = 131;
      break;
    case '2':
      count = 135;
      break;
    default:
      count = 125;
      break;
  }

  if (roverId === '14') {
    count = count + 15;
  }

  return count;
};

const MAX_DYNAMITES_LIMIT = () => {
  // @ts-ignore
  const transportId = extractURLParam(window.location, 'transportId');
  if (!transportId) return 125;

  switch (transportId) {
    case '13':
      return '3';
    default:
      return '1';
  }
};

const MAP_SIZE = { width: 3360, height: 2400 };
const TILES_WIDTH = 21;
const Y_POS_DIFF = 2;

const AVAILABLE_TILES_IDX = [
  MINING_MAP_OBJECT.empty,
  MINING_MAP_OBJECT.gate,
  MINING_MAP_OBJECT.rare_resource,
  MINING_MAP_OBJECT.common_resource,
  MINING_MAP_OBJECT.legendary_resource,
  MINING_MAP_OBJECT.worm,
  MINING_MAP_OBJECT.fuel
];

export {
  AVAILABLE_TILES_IDX,
  DEFAULT_HEIGHT,
  DEFAULT_WIDTH,
  GEAR_CATEGORIES,
  INITIAL_GAME_TIME,
  MAP_SIZE,
  MAX_DYNAMITES_LIMIT,
  MAX_HEIGHT,
  MAX_MOVES_LIMIT,
  MAX_WIDTH,
  MINING_GAME_INFO_DEFAULT,
  MINING_PREPARE_BORDER,
  MINING_PREPARE_MOBILE_BP,
  MINING_PREPARE_WIDTH,
  MISSIONS_BLOCK_TABS,
  MISSIONS_LIST,
  REPAIR_VARIANTS,
  SELECT_GEAR_BUTTON_ID,
  TILE_SIZE,
  TILES_WIDTH,
  TRANSPORT_DIRECTIONS,
  Y_POS_DIFF
};
