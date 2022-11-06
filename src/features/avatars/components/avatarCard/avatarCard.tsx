import React from 'react';
import { useLocation } from 'react-router-dom';
import useAvatarsMeta from '@avatars/hooks/useAvatarsMeta';
import { LIGHT_GREY_2 } from '@global/styles/variables';
import secondsToDhms from '@global/utils/secondsToDHMS';
import { currentLevelFromXp } from '@global/utils/xpToLevel';
import { TentIcon } from '@images/icons/TentIcon';
import { CommonButton } from '@root/legacy/buttons/commonButton';

import { AvatarStatsTopPanel, MissionsSpan } from './avatarCard.styles';
import {
  AvatarBlock,
  AvatarCardWrapper,
  AvatarMetaBlock,
  AvatarNameText,
  AvatarSpeciality,
  XPBonusWrapper
} from './avatarCard.styles';

type AvatarCardType = {
  isSelected: boolean;
  backgroundImg?: string;
  name?: string;
  onCardClick: () => void;
  metaLink?: string;
  missionsLimit?: number | string;
  xp: number;
  isCryoSelectMode?: boolean;
  isFrozen?: number;
  xpBonus?: string;
};

export const AvatarCard = ({
  isSelected,
  backgroundImg,
  name,
  onCardClick,
  metaLink = '',
  missionsLimit,
  xp,
  isCryoSelectMode,
  isFrozen,
  xpBonus
}: AvatarCardType) => {
  const { speciality } = useAvatarsMeta(metaLink);

  const location = useLocation();
  const isMissionsPage = location.pathname?.includes('missions');

  return (
    <AvatarCardWrapper
      isSelected={isSelected}
      backgroundImg={backgroundImg}
      isFrozenCard={Boolean(isFrozen)}
    >
      {Boolean(isFrozen) && (
        <XPBonusWrapper>{`${xpBonus} XP/DAY`}</XPBonusWrapper>
      )}

      <AvatarStatsTopPanel
        isMissionsPage={isMissionsPage}
        justifyContent={'center'}
        bg={'black'}
      >
        <div>
          <TentIcon />
          <span>
            {missionsLimit}
            <MissionsSpan pl={'2px'}>
              {missionsLimit === 1 ? 'mission' : 'missions'}
            </MissionsSpan>
          </span>
        </div>
      </AvatarStatsTopPanel>

      <AvatarMetaBlock>
        <AvatarBlock>
          <AvatarNameText>{name}</AvatarNameText>
        </AvatarBlock>
        <AvatarSpeciality>
          {speciality ?? <>&nbsp;</>}{' '}
          {`LVL ${currentLevelFromXp(xp)} | XP ${xp}`}
        </AvatarSpeciality>
        {Boolean(isFrozen) && (
          <CommonButton
            text={`STORED | ${secondsToDhms(isFrozen ?? 0)}`}
            onClick={onCardClick}
            mt={2}
            height="30px"
            disabled
            style={{
              border: 'none',
              color: 'rgba(0, 0, 0, 0.25)',
              background: `${LIGHT_GREY_2}`
            }}
          />
        )}
        {isCryoSelectMode && !Boolean(isFrozen) && (
          <CommonButton
            additionalClass={isSelected ? 'selected' : 'not-selected'}
            text={isSelected ? 'SELECTED' : 'SELECT TO STORE FOR 7 DAYS'}
            onClick={onCardClick}
            mt={2}
            height="30px"
          />
        )}
        {!isCryoSelectMode && !Boolean(isFrozen) && (
          <CommonButton
            additionalClass={isSelected ? 'selected' : 'not-selected'}
            text={isSelected ? 'Selected' : 'Select to play'}
            onClick={onCardClick}
            mt={2}
            height="30px"
          />
        )}
      </AvatarMetaBlock>
    </AvatarCardWrapper>
  );
};
