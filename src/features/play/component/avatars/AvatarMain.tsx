import React from 'react';

import { ParagraphAvatar } from './avatarUi/avatarsPopup.styles';
import { AvatarUI } from './avatarUi/avatarUi';
import { Block, Wrapper } from './avatar.styles';

const AvatarMain = () => {
  return (
    <Wrapper>
      <Block>
        <ParagraphAvatar>YOUR AVATAR</ParagraphAvatar>
        <AvatarUI />
      </Block>
    </Wrapper>
  );
};

export { AvatarMain };
