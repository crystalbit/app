import { NETWORK_DATA } from './index';

export type ChainData = {
  ticker: string;
  name: string;
  explorer: string;
  x2: undefined | '0x2';
};

export const APP_VERSION = process.env.REACT_APP_VERSION;

const HAR_CHAIN_ID = 1666600000;
const MUMBAI_CHAIN_ID = 80001;
const POLYGON_CHAIN_ID = 137;
const FUJI_CHAIN_ID = 43113;
type ChainId =
  | typeof HAR_CHAIN_ID
  | typeof POLYGON_CHAIN_ID
  | typeof MUMBAI_CHAIN_ID
  | typeof FUJI_CHAIN_ID;
export const CURRENT_NET = NETWORK_DATA.ID as ChainId;
const CHAIN_DATA: Record<ChainId, ChainData> = {
  [HAR_CHAIN_ID]: {
    ticker: 'ONE',
    name: 'Harmony Mainnet Shard 0',
    explorer: 'https://explorer.harmony.one',
    x2: undefined
  },
  [POLYGON_CHAIN_ID]: {
    ticker: 'MATIC',
    name: 'Polygon',
    explorer: 'https://polygonscan.com/',
    x2: undefined
  },
  [MUMBAI_CHAIN_ID]: {
    ticker: 'MATIC',
    name: 'Mumbai',
    explorer: 'https://mumbai.polygonscan.com/',
    x2: undefined
  },
  [FUJI_CHAIN_ID]: {
    ticker: 'AVAX',
    name: 'Fuji chain',
    explorer: 'https://testnet.snowtrace.io',
    x2: undefined
  }
};

export const CURRENT_CHAIN = CHAIN_DATA[CURRENT_NET];
