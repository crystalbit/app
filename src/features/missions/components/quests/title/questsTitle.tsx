import React, { CSSProperties, ReactElement } from 'react';

import { QuestsScreenTitle, TitleRound } from '../questsScreen.styles';

type QuestsTitleProps = {
  text: string | ReactElement;
  bgColor?: string;
  textColor?: string;
  additionalStyles?: CSSProperties;
};

export const QuestsTitle = ({
  text,
  bgColor,
  textColor,
  additionalStyles
}: QuestsTitleProps) => {
  return (
    <QuestsScreenTitle backgroundColor={bgColor} color={textColor}>
      <TitleRound borderColor={textColor} style={{ ...additionalStyles }} />
      <p>{text}</p>
    </QuestsScreenTitle>
  );
};
