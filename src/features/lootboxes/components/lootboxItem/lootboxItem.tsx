import React from 'react';
import { CommonButton } from '@root/legacy/buttons/commonButton';
import { NETWORK_DATA } from '@root/settings';

import {
  LootboxCardButtonWrapper,
  LootboxCardWrapper
} from './lootboxItem.styles';

export const LootboxItem = ({
  src,
  rarity
}: {
  src: string | number;
  rarity: string;
}) => {
  return (
    <LootboxCardWrapper
      backgroundImg={`${NETWORK_DATA.LOOTBOXES_META_LINK}/${src}/${rarity}.png`}
      gear={false}
    >
      <LootboxCardButtonWrapper>
        <CommonButton
          text="UNLOCK (COMING SOON)"
          onClick={() => {}}
          isPending
          pendingText="UNLOCK (COMING SOON)"
        />
      </LootboxCardButtonWrapper>
    </LootboxCardWrapper>
  );
};
