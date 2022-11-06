import React, { FC } from 'react';

import { SimpleTextWrapper } from '../questsScreen.styles';

export const SimpleText: FC = ({ children }) => {
  return <SimpleTextWrapper>{children}</SimpleTextWrapper>;
};
