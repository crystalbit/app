import React, { useMemo } from 'react';
import { BUTTON_TYPES } from '@features/missions/constants';

import {
  BlockScreenButton,
  CommonButtonWrapper,
  GreenQuestButtonText,
  TriangleButtonWrapper,
  WideButtonWrapper
} from '../questsScreen.styles';

export const ScreenButton = ({
  image,
  type,
  coords,
  callback,
  text = '',
  color,
  leftSwing
}: {
  image: string;
  type: string;
  coords: { top: number; left: number };
  callback: () => void;
  text?: string;
  color?: string;
  leftSwing?: string;
}) => {
  const componentToRender = useMemo(() => {
    switch (type) {
      case BUTTON_TYPES.common:
        return <CommonButtonWrapper src={image} />;
      case BUTTON_TYPES.wide:
        return <WideButtonWrapper src={image} />;
      case BUTTON_TYPES.triangle:
        return <TriangleButtonWrapper src={image} />;
    }
  }, [image, type]);

  const getLeftCoords = () => {
    if (leftSwing) return leftSwing;
    if (type === BUTTON_TYPES.wide && text.length >= 14) return '28%';
    if (type === BUTTON_TYPES.wide) return '37%';
    if (type === BUTTON_TYPES.common) return '40%';
    return type === BUTTON_TYPES.triangle && text.length >= 7 ? '25%' : '27%';
  };

  return (
    <BlockScreenButton
      onClick={callback}
      Position={'absolute'}
      Cursor={'pointer'}
      style={{
        ...coords
      }}
    >
      <GreenQuestButtonText
        color={color}
        type={type}
        Opacity={type === BUTTON_TYPES.triangle ? '0.5' : 'unset'}
        Left={getLeftCoords()}
      >
        {text}
      </GreenQuestButtonText>
      {componentToRender}
    </BlockScreenButton>
  );
};
