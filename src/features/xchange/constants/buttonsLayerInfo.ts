import { BUTTON_COLORS, BUTTON_TYPES } from '@features/missions/constants';

const dexScreenButtons = (
  callbacks: (() => void)[]
): Array<{
  type: string;
  color?: string;
  callback?: () => void;
  disabled?: boolean;
  text?: string;
}> => {
  return [
    {
      type: BUTTON_TYPES.wide,
      callback: callbacks[0],
      color: BUTTON_COLORS.green,
      text: 'Swap'
    },
    {
      type: BUTTON_TYPES.wide,
      callback: callbacks[1],
      color: BUTTON_COLORS.green,
      text: 'Pool'
    },
    {
      type: BUTTON_TYPES.wide,
      callback: callbacks[2],
      color: BUTTON_COLORS.green,
      text: 'Farm'
    }
  ];
};

export { dexScreenButtons };
