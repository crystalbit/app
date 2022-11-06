import { NETWORK_DATA } from '@root/settings';

const PROFILE_TABS: {
  label: string;
  isActive: boolean;
}[] = [
  {
    label: 'Profile',
    isActive: NETWORK_DATA.PROFILE
  },
  {
    label: 'Leaderboard',
    isActive: true
  }
];

const USER_TABS: {
  label: string;
}[] = [
  {
    label: 'Lands'
  },
  {
    label: 'Avatars'
  }
];

const CHAIN_TABS: {
  label: string;
}[] = [
  {
    label: 'Harmony'
  },
  {
    label: 'Polygon'
  }
];

const LEADERBOARD: {
  label: string;
}[] = [
  {
    label: 'Avatars'
  },
  {
    label: 'Users'
  }
];

const LB_AVATARS_ATTRIBUTES: {
  label: string;
}[] = [
  {
    label: 'LVL'
  },
  {
    label: 'XP'
  },
  {
    label: 'Mission passed'
  }
];

const LB_USERS_ATTRIBUTES: {
  label: string;
}[] = [
  {
    label: 'CLNY Burned'
  },
  {
    label: 'Missions'
  }
];

const ONE_TIME_LINE: {
  label: string;
}[] = [
  {
    label: 'All time'
  }
];

const TIME_LINE: {
  label: string;
}[] = [
  {
    label: 'All time'
  },
  {
    label: 'Monthly'
  },
  {
    label: 'Weekly'
  }
];

export {
  CHAIN_TABS,
  LB_AVATARS_ATTRIBUTES,
  LB_USERS_ATTRIBUTES,
  LEADERBOARD,
  ONE_TIME_LINE,
  PROFILE_TABS,
  TIME_LINE,
  USER_TABS
};
