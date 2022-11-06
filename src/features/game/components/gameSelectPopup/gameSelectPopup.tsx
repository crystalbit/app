import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useOutsideClick from '@global/hooks/useOutsideClick';
import { trackUserEvent } from '@global/utils/analytics';
import { LmIcon } from '@images/icons/LMIcon';
import { MissionsIcon } from '@images/icons/MissionsIcon';
import { ReplaceIcon } from '@images/icons/ReplaceIcon';
import { NETWORK_DATA } from '@root/settings';
import { gameInfoPopupSelector } from '@selectors/gameManagerSelectors';
import { clnyBalanceSelector } from '@selectors/userStatsSelectors';
import {
  DEFAULT_POPUP_STATE,
  setGamePopupInfo,
  setReplaceMode
} from '@slices/gameManagementSlice';

import {
  GameSelectInnerWrapper,
  GameSelectPopupBottom,
  GameSelectPopupBottomItem,
  GameSelectPopupLevel,
  GameSelectPopupList,
  GameSelectPopupText,
  GameSelectPopupTitle,
  GameSelectPopupWrapper
} from './gameSelectPopup.styles';

export const GameSelectPopup = () => {
  const ref = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const clnyBalance = useSelector(clnyBalanceSelector);
  const id = new URLSearchParams(window.location.search).get('id');
  const { title, text, level, x, y, isActive, actions, type } = useSelector(
    gameInfoPopupSelector
  );

  useOutsideClick(ref, () => dispatch(setGamePopupInfo(DEFAULT_POPUP_STATE)));

  if (!isActive) return null;

  return (
    <GameSelectPopupWrapper
      x={x}
      y={y}
      ref={ref}
      onClick={(e) => e.stopPropagation()}
    >
      <GameSelectInnerWrapper>
        {type !== 'SpaceXChange' && (
          <GameSelectPopupLevel>{`${level}/${
            type === 'Base Station' ? '1' : '3'
          } LVL`}</GameSelectPopupLevel>
        )}
        <GameSelectPopupTitle>{title}</GameSelectPopupTitle>
        <GameSelectPopupText>{text}</GameSelectPopupText>
      </GameSelectInnerWrapper>
      <GameSelectPopupBottom>
        <GameSelectPopupList itemsCount={actions.length}>
          {Boolean(actions?.includes('missions')) && (
            <GameSelectPopupBottomItem
              onClick={(e) => {
                e.stopPropagation();
                trackUserEvent('Missions on base station clicked');
                window.open(
                  `${window.location.origin}/missions/${id}`,
                  '_self'
                );
              }}
            >
              <p>Missions</p>
              <MissionsIcon />
            </GameSelectPopupBottomItem>
          )}
          {Boolean(actions?.includes('replace')) && (
            <GameSelectPopupBottomItem
              isDisabled={clnyBalance < 5}
              onClick={(e) => {
                e.stopPropagation();
                if (clnyBalance < 5) return;
                dispatch(setReplaceMode(true));
                window.replace(type);
              }}
            >
              <p>MOVE FOR 5 {NETWORK_DATA.TOKEN_NAME}</p>
              <ReplaceIcon />
            </GameSelectPopupBottomItem>
          )}
          {Boolean(actions?.includes('enter-sex')) && (
            <GameSelectPopupBottomItem
              onClick={() => {
                window.open(`${window.location.origin}/xchange`, '_self');
              }}
            >
              <p>ENTER DEX</p>
              <LmIcon />
            </GameSelectPopupBottomItem>
          )}
        </GameSelectPopupList>
      </GameSelectPopupBottom>
    </GameSelectPopupWrapper>
  );
};
