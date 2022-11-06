import { NETWORK_DATA } from '@root/settings';

// @see https://people.marscolony.io/t/mars-colony-tokenomic/53

const OLD_NEW =
  NETWORK_DATA.ECONOMY === 'fixed'
    ? [[0, 2], [2, 3], [3, 4], undefined]
    : [[0, 1], [1, 2], [2, 4], undefined];

const PRICES =
  NETWORK_DATA.ECONOMY === 'fixed' ? [0, 120, 270, 480] : [0, 60, 120, 240];

export { OLD_NEW, PRICES };
