import { BUTTON_COLORS, BUTTON_TYPES } from '@features/missions/constants';
import { store } from '@redux/store';

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const screenButtons = (callbacks: (() => void)[]) => {
  const isLeaveScreen = store?.getState()?.quests?.isLeaveScreen;

  let buttonsArr: Record<
    string,
    {
      type: string;
      color?: string;
      callback?: () => void;
      disabled?: boolean;
      text?: string;
      left?: string;
    }[]
  > = {
    selectScreen: [
      {
        type: BUTTON_TYPES.triangle,
        callback: callbacks[0],
        color: BUTTON_COLORS.red,
        text: 'Select'
      },
      {
        type: BUTTON_TYPES.common,
        callback: callbacks[1],
        color: BUTTON_COLORS.green,
        disabled: true
      },
      {
        type: BUTTON_TYPES.common,
        callback: callbacks[2],
        color: BUTTON_COLORS.green,
        text: 'Next Land',
        left: '30%'
      },
      {
        type: BUTTON_TYPES.wide,
        callback: callbacks[3],
        color: BUTTON_COLORS.green,
        text: 'Select'
      },
      {
        type: BUTTON_TYPES.triangle,
        callback: callbacks[4],
        color: BUTTON_COLORS.red
      }
    ],
    instructions: [
      {
        type: BUTTON_TYPES.triangle,
        callback: callbacks[0],
        color: BUTTON_COLORS.red
      },
      {
        type: BUTTON_TYPES.common,
        callback: callbacks[1],
        color: BUTTON_COLORS.red,
        text: 'Exit'
      },
      {
        type: BUTTON_TYPES.common,
        callback: callbacks[2],
        color: BUTTON_COLORS.green,
        disabled: true
      },
      {
        type: BUTTON_TYPES.wide,
        callback: callbacks[3],
        color: BUTTON_COLORS.green,
        text: 'Start'
      },
      {
        type: BUTTON_TYPES.triangle,
        callback: callbacks[4],
        color: BUTTON_COLORS.red
      }
    ],
    playDecrypt: [
      {
        type: BUTTON_TYPES.triangle,
        callback: callbacks[0],
        color: BUTTON_COLORS.red,
        disabled: true
      },
      {
        type: BUTTON_TYPES.common,
        callback: callbacks[1],
        color: isLeaveScreen ? BUTTON_COLORS.red : BUTTON_COLORS.yellow,
        text: isLeaveScreen ? 'Exit' : 'Leave'
      },
      {
        type: BUTTON_TYPES.common,
        callback: callbacks[2],
        color: BUTTON_COLORS.green,
        disabled: true
      },
      {
        type: BUTTON_TYPES.wide,
        callback: callbacks[3],
        color: BUTTON_COLORS.green,
        disabled: !isLeaveScreen,
        text: 'Back to the game'
      },
      {
        type: BUTTON_TYPES.triangle,
        callback: callbacks[4],
        color: BUTTON_COLORS.red
      }
    ],
    playCoding: [
      {
        type: BUTTON_TYPES.triangle,
        callback: callbacks[0],
        color: BUTTON_COLORS.red,
        disabled: true
      },
      {
        type: BUTTON_TYPES.common,
        callback: callbacks[1],
        color: isLeaveScreen ? BUTTON_COLORS.red : BUTTON_COLORS.yellow,
        text: isLeaveScreen ? 'Exit' : 'Leave'
      },
      {
        type: BUTTON_TYPES.common,
        callback: callbacks[2],
        color: BUTTON_COLORS.green,
        disabled: true
      },
      {
        type: BUTTON_TYPES.wide,
        callback: callbacks[3],
        color: BUTTON_COLORS.green,
        disabled: !isLeaveScreen,
        text: 'Back to the game'
      },
      {
        type: BUTTON_TYPES.triangle,
        callback: callbacks[4],
        color: BUTTON_COLORS.red
      }
    ],
    success: [
      {
        type: BUTTON_TYPES.triangle,
        callback: callbacks[0],
        color: BUTTON_COLORS.green,
        disabled: true
      },
      {
        type: BUTTON_TYPES.common,
        callback: callbacks[1],
        color: BUTTON_COLORS.green,
        disabled: true
      },
      {
        type: BUTTON_TYPES.common,
        callback: callbacks[2],
        color: BUTTON_COLORS.green,
        disabled: true
      },
      {
        type: BUTTON_TYPES.wide,
        callback: callbacks[3],
        color: BUTTON_COLORS.green,
        disabled: true
      },
      {
        type: BUTTON_TYPES.triangle,
        callback: callbacks[4],
        color: BUTTON_COLORS.green,
        text: 'Collect'
      }
    ],
    restart: [
      {
        type: BUTTON_TYPES.triangle,
        callback: callbacks[0],
        color: BUTTON_COLORS.green,
        disabled: true
      },
      {
        type: BUTTON_TYPES.common,
        callback: callbacks[1],
        color: BUTTON_COLORS.green,
        disabled: true
      },
      {
        type: BUTTON_TYPES.common,
        callback: callbacks[2],
        color: BUTTON_COLORS.green,
        disabled: true
      },
      {
        type: BUTTON_TYPES.wide,
        callback: callbacks[3],
        color: BUTTON_COLORS.green,
        text: 'Find a mission'
      },
      {
        type: BUTTON_TYPES.triangle,
        callback: callbacks[4],
        color: BUTTON_COLORS.green,
        text: 'Collect',
        disabled: true
      }
    ]
  };

  return buttonsArr;
};

export { capitalizeFirstLetter, screenButtons };
