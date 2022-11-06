import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useAvatarsMeta from '@avatars/hooks/useAvatarsMeta';
import useFlags from '@global/hooks/useFlags';
import useRoutes from '@global/hooks/useRoutes';
import { trackUserEvent } from '@global/utils/analytics';
import secondsToDhms from '@global/utils/secondsToDHMS';
import { currentLevelFromXp } from '@global/utils/xpToLevel';
import { TentIcon } from '@images/icons/TentIcon';
import { selectedAvatarSelector } from '@redux/selectors/avatarsSelectors';
import { toggleMyLandPopup } from '@redux/slices/appPartsSlice';
import {
  setAvatarEdit,
  switchAvatarsSelectMode
} from '@redux/slices/avatarsSlice';
import { CommonButton } from '@root/legacy/buttons/commonButton';

import { Rename } from '../avatarUi/avatarsPopup.styles';

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
  tokenNum?: string;
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
  xpBonus,
  tokenNum
}: AvatarCardType) => {
  const { isMissionsPage } = useRoutes();
  const { isMissionsAvailable } = useFlags();
  const { speciality } = useAvatarsMeta(metaLink);

  const additionalStyleClass = isSelected ? 'selected' : 'not-selected';
  const isRenameAvailable = Boolean(
    name?.length && !isMissionsPage && !isCryoSelectMode
  );

  const dispatch = useDispatch();
  const selectedAvatar = useSelector(selectedAvatarSelector);
  const onAvatarEdit = (e: any) => {
    trackUserEvent('Rename avatar clicked');
    e.stopPropagation();
    dispatch(setAvatarEdit(tokenNum ?? selectedAvatar));
    dispatch(switchAvatarsSelectMode(false));
    dispatch(toggleMyLandPopup(null));
  };

  return (
    <AvatarCardWrapper
      isSelected={isSelected}
      backgroundImg={backgroundImg}
      isFrozenCard={Boolean(isFrozen)}
    >
      {Boolean(isFrozen) && (
        <XPBonusWrapper>{`${xpBonus} XP/DAY`}</XPBonusWrapper>
      )}

      {isMissionsAvailable && (
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
      )}

      <AvatarMetaBlock>
        <AvatarBlock>
          <AvatarNameText>{name}</AvatarNameText>
          {isRenameAvailable && <Rename onClick={onAvatarEdit}>Rename</Rename>}
        </AvatarBlock>
        <AvatarSpeciality>
          {speciality ?? '...'} {`LVL ${currentLevelFromXp(xp)} | XP ${xp}`}
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
              background: '#ACADB9'
            }}
          />
        )}
        {isCryoSelectMode && !Boolean(isFrozen) && (
          <CommonButton
            additionalClass={additionalStyleClass}
            text={isSelected ? 'SELECTED' : 'SELECT TO STORE FOR 7 DAYS'}
            onClick={onCardClick}
            mt={2}
            height="30px"
          />
        )}
        {!isCryoSelectMode && !Boolean(isFrozen) && (
          <CommonButton
            additionalClass={additionalStyleClass}
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
