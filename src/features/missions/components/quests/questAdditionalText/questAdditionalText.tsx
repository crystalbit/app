import React, { ReactElement } from 'react';

import { TextContentWrapper } from '../questsScreen.styles';

type QuestAdditionalTextProps = {
  text: string | ReactElement;
};

export const QuestAdditionalText = ({ text }: QuestAdditionalTextProps) => {
  return <TextContentWrapper>{text}</TextContentWrapper>;
};
