import { GEAR_CATEGORIES } from '@features/play/constants';
import { GearItemType } from '@features/play/types';
import CommonTransportImage from '@images/photo/gears/common-transport.jpg';
import { NETWORK_DATA } from '@root/settings';

const getCategoryItem = (
  list: GearItemType[],
  category: keyof typeof GEAR_CATEGORIES
) => list.filter((i) => i.category === GEAR_CATEGORIES[category]);

const filterUserGears = (gears: { '0': string[]; '1': GearItemType[] }) => {
  if (!gears)
    return {
      transports: [
        {
          default: true,
          src: CommonTransportImage,
          id: '-1',
          gearType: '-1',
          locked: true
        }
      ],
      utilities: {
        drills: [],
        engines: [],
        scanners: [],
        transmitters: []
      }
    };

  const mergedGear = gears['1'].map((g, idx) => {
    return {
      ...g,
      src: `${NETWORK_DATA.GEAR_META_LINK}/${gears['0'][idx]}`,
      id: gears['0'][idx],
      default: false
    };
  });

  const transportsGear = mergedGear.filter(
    (g) => g.category === GEAR_CATEGORIES.transports
  );

  const commonItems = mergedGear.filter(
    (g) => g.category !== GEAR_CATEGORIES.transports
  );

  const transports = [
    {
      default: true,
      src: CommonTransportImage,
      id: '-1',
      gearType: '-1',
      locked: true
    },
    ...transportsGear
  ];

  return {
    transports,
    utilities: {
      drills: getCategoryItem(commonItems, 'drills'),
      engines: getCategoryItem(commonItems, 'engines'),
      scanners: getCategoryItem(commonItems, 'scanners'),
      transmitters: getCategoryItem(commonItems, 'transmitters')
    }
  };
};

const mapKeyToGearTitle = (key: string) => {
  switch (key) {
    case 'drills':
      return 'Drill';
    case 'engines':
      return 'Engine';
    case 'scanners':
      return 'Scanner';
    case 'transmitters':
      return 'Transmitter';
    default:
      return '';
  }
};

const mapNumberToCategory = (numberKey: '0' | '1' | '2' | '3') => {
  switch (numberKey) {
    case '0':
      return 'engines';
    case '1':
      return 'drills';
    case '2':
      return 'scanners';
    case '3':
      return 'transmitters';
    default:
      return '';
  }
};

const compareArrays = <T>(a1: T[], a2: T[]): boolean => {
  return a1.length === a2.length && a1.every((v, i) => v === a2[i]);
};

export {
  compareArrays,
  filterUserGears,
  mapKeyToGearTitle,
  mapNumberToCategory
};
