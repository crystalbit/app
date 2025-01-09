import { polygonGas } from '@root/settings/gas';

export const contracts: Record<
  string,
  {
    CHAIN: string;
    TOKEN_NAME: string;
    ID: number;
    RPC: string;
    MC: string;
    CLNY: string;
    GM: string;
    AM: string;
    MM: string;
    LB: string;
    CH: string;
    ORACLE: string;
    REPLACE: string;
    MINING_POOLS: Array<{
      contract: string;
      statsContract: string;
      lpTokenContract: string;
      lpTicker: string;
      dex: string;
      pair: string;
      imgKey: string;
      multiplier?: number;
    }>;
    BACKEND: string;
    LAND_META: string;
    LAND_META_SERVER: string;
    AVATAR_META: string;
    AVATAR_MINTING: boolean;
    SOLDOUT: boolean;
    LIQUIDITY_MINING: boolean;
    GLOBE: 'arcgis' | 'openglobus';
    ECONOMY: 'fixed' | 'shares';
    DEFAULT_ACCOUNT_STATE: 'lands' | 'cart' | null;
    AVATARS: boolean;
    MISSIONS: boolean;
    DEX: boolean;
    TWITTER: boolean;
    PROFILE: boolean;
    LOOTBOXES: boolean;
    LOOTBOXES_AVAILABLE: boolean;
    MISSIONS_POPUP: boolean;
    CRYOCHAMBERS: boolean;
    REF_PAGE: boolean;
    IS_SIDEBAR_UPDATE: boolean;
    REVSHARE: boolean;
    UI_DESIGN_VARIANT: 'Polygon' | 'Harmony';
    IS_HARMONY_TEST_METRICS: boolean;
    IS_CART_FUNC: boolean;
    SALE_BANNER: boolean;
    MAP_TYPE: 'Polygon' | 'Harmony';
    STATS_HEADER: boolean;
    IN_GAME_LAND: boolean;
    MINT_PRICE: number;
    GAS_FUNC?: () => void;
    CRYO_GAS_PRICE?: number;
    LOOTBOXES_META_LINK: string;
    GEARS: string;
    LOOTBOX_OPEN_PRICE: Record<string, number>;
    GEAR_META_LINK: string;
    CHAMBER_PRICE: number;
    TRANSPORT_REPAIR_PRICE: {
      25: number;
      50: number;
      100: number;
    };
  }
> = {
  harmony: {
    CHAIN: 'Harmony',
    TOKEN_NAME: 'CLNY',
    ID: 1666600000,
    RPC: 'https://api.s0.t.hmny.io',
    MC: '0x0bC0cdFDd36fc411C83221A348230Da5D3DfA89e',
    CLNY: '0x0D625029E21540aBdfAFa3BFC6FD44fB4e0A66d0',
    GM: '0x0D112a449D23961d03E906572D8ce861C441D6c3',
    AM: '0xCc55065afd013CF06f989448cf724fEC4fF29626',
    MM: '0x0Ef27447c72Fc9809864E1aa3998B76B61c20a8A',
    LB: '0xd88980c139f0267a0af9eaa21dd3062f79515d74',
    CH: '0x2D2f5349896BF4012EA27Db345fbF8a71775d16f',
    REPLACE: '0x0d5cb682858fd1eaa1ae61c9e42b2ac0243d5d22',
    MINING_POOLS: [
      {
        contract: '0x213059740B4A99b16946d48266a710BFD8F56009',
        statsContract: '0x8eeAE515C84fDf6CA186eBE8407a896b67611613',
        lpTokenContract: '0xD5D191c733306A8Fe9C9A3166D9cbe2a0E407979',
        lpTicker: 'CLP',
        dex: 'MarsColony DEX',
        pair: 'CLNY/ONE',
        imgKey: 'clny-harmony'
      },
      {
        contract: '0x211E6db1D406C68b60ad6553016b73E0F12AdfC1',
        statsContract: '0xF2442B32AD5C45f09F3Ff9d352854b5378527698',
        lpTokenContract: '0x8A1A4957153f9055aF0AEC3Bdc1a247D74d0e869',
        lpTicker: 'μCLP',
        dex: 'MarsColony DEX',
        pair: 'USDC/CLNY',
        imgKey: 'clny-usdc',
        multiplier: 1_000_000
      },
      {
        contract: '0xe3fF96e6020B8606f923518704970A7AfA73DC3f',
        statsContract: '0x8600F6E9cD3406F8173749A582bC993e74ed7be8',
        lpTokenContract: '0xcd818813F038A4d1a27c84d24d74bBC21551FA83',
        lpTicker: 'SLP',
        dex: 'SushiSwap',
        pair: 'CLNY/ONE',
        imgKey: 'clny-harmony'
      }
    ],
    BACKEND: 'https://backend-harmony.marscolony.io',
    LAND_META: 'https://meta.marscolony.io/tokens',
    LAND_META_SERVER: 'https://meta.marscolony.io/',
    AVATAR_META: 'https://meta-avatar.marscolony.io/',
    AVATAR_MINTING: false,
    SOLDOUT: true,
    LIQUIDITY_MINING: true,
    GLOBE: 'arcgis',
    ECONOMY: 'fixed',
    DEFAULT_ACCOUNT_STATE: 'lands',
    AVATARS: true,
    MISSIONS: true,
    DEX: true,
    TWITTER: false,
    PROFILE: true,
    LOOTBOXES: true,
    LOOTBOXES_AVAILABLE: true,
    MISSIONS_POPUP: true,
    CRYOCHAMBERS: true,
    REF_PAGE: false,
    REVSHARE: true,
    IS_SIDEBAR_UPDATE: false,
    UI_DESIGN_VARIANT: 'Harmony',
    IS_HARMONY_TEST_METRICS: false,
    IS_CART_FUNC: false,
    SALE_BANNER: true,
    MAP_TYPE: 'Harmony',
    STATS_HEADER: false,
    IN_GAME_LAND: true,
    MINT_PRICE: 30,
    CRYO_GAS_PRICE: 10,
    LOOTBOXES_META_LINK: 'https://lootboxes-harmony.marscolony.io',
    GEARS: '0xc909dbAFf39b0DfD35F398459335aD98B7A0f3AE',
    LOOTBOX_OPEN_PRICE: { '0': 2, '1': 4, '2': 8 },
    GEAR_META_LINK: 'https://gears-harmony.marscolony.io',
    ORACLE: '0xCf8411efc10157B5E6DA758B79f5d5D35f115a2A',
    CHAMBER_PRICE: 120,
    TRANSPORT_REPAIR_PRICE: {
      '25': 1.5,
      '50': 2,
      '100': 4
    }
  },
  mumbai: {
    CHAIN: 'Mumbai',
    TOKEN_NAME: 'pCLNY',
    ID: 80001,
    RPC: 'https://polygon-amoy.drpc.org',
    MC: '0xBF5C3027992690d752be3e764a4B61Fc6910A5c0',
    CLNY: '0x73E6432Ec675536BBC6825E16F1D427be44B9639',
    GM: '0xCAFAeD55fEfEd74Ca866fE72D65CfF073eb42797',
    AM: '0x85f8e0aBdb0f45D8488ca608Ac6327Edd3705de2',
    MM: '0xf91719366dec915741E57b246f97048D4b5D338e',
    CH: '0x38995D9579BD7e39cd7BFeCdbe50321b1bFa4dfB',
    LB: '0x1c36C79E63AAc2294E8382ba0DC582623d0002DC',
    REPLACE: '0xDF9868591ab3C9596E3476e33D8B876f38751FC1',
    MINING_POOLS: [],
    BACKEND: 'https://backend-mumbai.marscolony.io',
    LAND_META: 'https://meta-mumbai.marscolony.io/tokens',
    LAND_META_SERVER: 'https://meta-mumbai.marscolony.io/',
    AVATAR_META: 'https://meta-avatar-test.marscolony.io/',
    AVATAR_MINTING: true,
    SOLDOUT: false,
    LIQUIDITY_MINING: false,
    GLOBE: 'openglobus',
    ECONOMY: 'shares',
    DEFAULT_ACCOUNT_STATE: 'lands',
    AVATARS: true,
    MISSIONS: true,
    DEX: false,
    TWITTER: false,
    PROFILE: true,
    LOOTBOXES: true,
    LOOTBOXES_AVAILABLE: true,
    CRYOCHAMBERS: true,
    MISSIONS_POPUP: true,
    REF_PAGE: true,
    IS_SIDEBAR_UPDATE: false,
    REVSHARE: true,
    UI_DESIGN_VARIANT: 'Polygon',
    IS_HARMONY_TEST_METRICS: false,
    IS_CART_FUNC: true,
    SALE_BANNER: true,
    MAP_TYPE: 'Polygon',
    STATS_HEADER: true,
    IN_GAME_LAND: true,
    MINT_PRICE: 90,
    CRYO_GAS_PRICE: 20,
    LOOTBOXES_META_LINK: 'https://lootboxes-mumbai.marscolony.io',
    GEARS: '0xBa83d3db8124689c3498A5C578f892A6058556Fb',
    LOOTBOX_OPEN_PRICE: { '0': 2, '1': 4, '2': 8 },
    GEAR_META_LINK: 'https://gears-mumbai.marscolony.io',
    ORACLE: '0x89a615773b5949D33498dF01B38eC32262d63D49',
    CHAMBER_PRICE: 120,
    TRANSPORT_REPAIR_PRICE: {
      '25': 1.5,
      '50': 2,
      '100': 4
    }
  },
  polygon: {
    CHAIN: 'Polygon',
    TOKEN_NAME: 'pCLNY',
    ID: 137,
    RPC: 'https://rpc.ankr.com/polygon',
    MC: '0x3B45B2AEc65A4492B7bd3aAd7d9Fa8f82B79D4d0',
    CLNY: '0xCEBaF32BBF205aDB2BcC5d2a5A5DAd91b83Ba424',
    GM: '0xCAFAeD55fEfEd74Ca866fE72D65CfF073eb42797',
    CH: '0x4B895e733B8F1D50ec7f92BccCF763f85b5f963b',
    AM: '0xE29163dE0dD747f55d5D2287d5FE874F65C9Fa8E',
    MM: '0x84De29C1060e0b25F9B9966BFe8652a8e80d1396',
    LB: '0x124156E8acF1474fd23289513351668bb891e9d1',
    REPLACE: '0x331eD65Ecb4FB76376874772f300a2C897A8c25E',
    MINING_POOLS: [],
    BACKEND: 'https://backend-polygon.marscolony.io',
    LAND_META: 'https://meta-polygon.marscolony.io/tokens',
    LAND_META_SERVER: 'https://meta-polygon.marscolony.io/',
    AVATAR_META: 'https://meta-avatar-polygon.marscolony.io/',
    AVATAR_MINTING: true,
    SOLDOUT: false,
    LIQUIDITY_MINING: false,
    GLOBE: 'openglobus',
    ECONOMY: 'shares',
    DEFAULT_ACCOUNT_STATE: 'lands',
    AVATARS: true,
    MISSIONS: true,
    DEX: false,
    TWITTER: true,
    PROFILE: true,
    LOOTBOXES: true,
    LOOTBOXES_AVAILABLE: true, // opening available
    CRYOCHAMBERS: true,
    MISSIONS_POPUP: true,
    REF_PAGE: true,
    REVSHARE: true,
    IS_SIDEBAR_UPDATE: false,
    UI_DESIGN_VARIANT: 'Polygon',
    IS_HARMONY_TEST_METRICS: false,
    IS_CART_FUNC: true,
    SALE_BANNER: true,
    MAP_TYPE: 'Polygon',
    STATS_HEADER: true,
    MINT_PRICE: 90,
    IN_GAME_LAND: true,
    GAS_FUNC: () => polygonGas(),
    CRYO_GAS_PRICE: 20,
    LOOTBOXES_META_LINK: 'https://lootboxes-polygon.marscolony.io',
    GEARS: '0x1a33FAC010248AFcA0741f5c10acaBA0e3CA6814',
    LOOTBOX_OPEN_PRICE: { '0': 2, '1': 4, '2': 8 },
    GEAR_META_LINK: 'https://gears-polygon.marscolony.io',
    ORACLE: '0x70126604f9628FABfc6D0a6B7B61A151Da71a0D3',
    CHAMBER_PRICE: 120,
    TRANSPORT_REPAIR_PRICE: {
      '25': 1,
      '50': 1.5,
      '100': 3
    }
  },
  fuji: {
    CHAIN: 'Avalanche Fuji Testnet',
    TOKEN_NAME: 'CLNY',
    ID: 43113,
    RPC: 'https://api.avax-test.network/ext/bc/C/rpc',
    MC: '0x031D6A8eD3d5ad28b026FF2098Fc2a1d0DB9DcF2',
    CLNY: '0xC6C5b8a181Bbb8AB5cB88dBF424892ee278f6BBc',
    GM: '0x0Dd5dDaC089613F736e89F81E16361b09c7d53C6',
    AM: '0x0D625029E21540aBdfAFa3BFC6FD44fB4e0A66d0',
    MM: '0xf3f2f703b7BaAfD09f7a1C41b06e2D04B0Fad09C',
    LB: '0xfCFA578EcDD33496076255563852804a53A80535',
    CH: '0x9166461379cF2fd6633e13A115B367DE46c29101',
    REPLACE: '0xa931Daf108177cb37b28aD98B545aD0D22073025',
    MINING_POOLS: [],
    BACKEND: 'https://backend.marscolony.io',
    LAND_META: 'https://meta-fuji.marscolony.io/tokens',
    LAND_META_SERVER: 'https://meta-fuji.marscolony.io/',
    AVATAR_META: 'https://meta-avatar-test.marscolony.io/',
    AVATAR_MINTING: true,
    SOLDOUT: false,
    LIQUIDITY_MINING: false,
    GLOBE: 'arcgis',
    ECONOMY: 'fixed',
    DEFAULT_ACCOUNT_STATE: 'lands',
    AVATARS: true,
    MISSIONS: true,
    DEX: false,
    TWITTER: false,
    PROFILE: true,
    LOOTBOXES: true,
    LOOTBOXES_AVAILABLE: true,
    MISSIONS_POPUP: true,
    CRYOCHAMBERS: true,
    REF_PAGE: false,
    REVSHARE: true,
    IS_SIDEBAR_UPDATE: false,
    UI_DESIGN_VARIANT: 'Harmony',
    IS_HARMONY_TEST_METRICS: false,
    IS_CART_FUNC: false,
    SALE_BANNER: true,
    MAP_TYPE: 'Harmony',
    STATS_HEADER: false,
    IN_GAME_LAND: true,
    MINT_PRICE: 90,
    CRYO_GAS_PRICE: 10,
    LOOTBOXES_META_LINK: 'https://lootboxes-harmony.marscolony.io',
    GEARS: '0x98Ef6554fA8f009b3330488B10649dEf50a5690a',
    LOOTBOX_OPEN_PRICE: { '0': 2, '1': 4, '2': 8 },
    GEAR_META_LINK: 'https://gears-fuji.marscolony.io',
    ORACLE: '0xB630453b5e8d57Be0E4652bE84B28Ebf5D1C787C',
    CHAMBER_PRICE: 120,
    TRANSPORT_REPAIR_PRICE: {
      '25': 1,
      '50': 1.5,
      '100': 3
    }
  },
  'zero-testnet': {
    CHAIN: 'Zero Testnet',
    TOKEN_NAME: 'CLNY',
    ID: 4457845,
    RPC: 'https://rpc.zerion.io/v1/zero-sepolia',
    MC: '0x1DFdfF98e9A46AF0a9F99c32655023bA679473B4',
    CLNY: '0xbEC8B717e5C20A68B1Db0BcEdC99e7423995dd1E',
    GM: '0xCDA72A6770E58FE26Fb26577Aee101749b22F0F1',
    AM: '0xA3d09B55649215707121200c1f6f2bdb9163D7A5',
    MM: '0xe1985Cd355B0aa74aFCBD28394F790e486219D3d',
    LB: '0x9F8C13b096ba448B6Fd0294252353E4f86Ae5570',
    CH: '0xb61147D2c21Da8f1a4Be658157eF5545268D3497',
    REPLACE: '0x93edc8c562365cD72401FfF3b9DC996c249649F9',
    MINING_POOLS: [],
    BACKEND: 'https://backend-harmony.marscolony.io',
    LAND_META: 'https://zero-meta.router9.xyz/tokens',
    LAND_META_SERVER: 'https://zero-meta.router9.xyz/',
    AVATAR_META: 'https://meta-avatar.marscolony.io/',
    AVATAR_MINTING: true,
    SOLDOUT: false,
    LIQUIDITY_MINING: false,
    GLOBE: 'openglobus',
    ECONOMY: 'fixed',
    DEFAULT_ACCOUNT_STATE: 'lands',
    AVATARS: false,
    MISSIONS: false,
    DEX: false,
    TWITTER: false,
    PROFILE: true,
    LOOTBOXES: false,
    LOOTBOXES_AVAILABLE: false,
    MISSIONS_POPUP: false,
    CRYOCHAMBERS: false,
    REF_PAGE: false,
    REVSHARE: false,
    IS_SIDEBAR_UPDATE: false,
    UI_DESIGN_VARIANT: 'Harmony',
    IS_HARMONY_TEST_METRICS: false,
    IS_CART_FUNC: false,
    SALE_BANNER: true,
    MAP_TYPE: 'Harmony',
    STATS_HEADER: true,
    IN_GAME_LAND: true,
    MINT_PRICE: 30,
    CRYO_GAS_PRICE: 10,
    LOOTBOXES_META_LINK: 'https://lootboxes-harmony.marscolony.io',
    GEARS: '0xc909dbAFf39b0DfD35F398459335aD98B7A0f3AE',
    LOOTBOX_OPEN_PRICE: { '0': 2, '1': 4, '2': 8 },
    GEAR_META_LINK: 'https://gears-harmony.marscolony.io',
    ORACLE: '',
    CHAMBER_PRICE: 120,
    TRANSPORT_REPAIR_PRICE: {
      '25': 1.5,
      '50': 2,
      '100': 4
    }
  }
};

const current_network = process.env.REACT_APP_NETWORK;

export const NETWORK_DATA = contracts[current_network ?? ''];
