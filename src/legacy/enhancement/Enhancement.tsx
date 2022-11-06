import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LandPlotEarnedButton } from '@features/lands/styles/landPlot.styles';
import { Ticked } from '@global/components/ticked/Ticked';
import { EnhButton } from '@root/legacy/buttons/enhButton/EnhButton';
import { NETWORK_DATA } from '@root/settings';
import { isReplaceModeSelector } from '@selectors/gameManagerSelectors';
import {
  changeGameMode,
  GAME_VIEW_MODES,
  selectObjectToSet
} from '@slices/gameManagementSlice';

import {
  EhchSidebarWrapper,
  EnhButtonError
} from '../buttons/enhButton/enhButton.styles';

import {
  CounterBlock,
  CounterBlockWrapper,
  EnhancementItemWrapper,
  EnhAux,
  EnhBlockMinifiedWrapper,
  EnhButtonOuterWrapper,
  EnhImageWrapper,
  EnhOldNew,
  EnhTitle
} from './enhancements.styles';

type Props = {
  title: string;
  Image: React.FC;
  aux?: string;
  speed?: number;
  finalText?: string;
  getWhat: string;
  price: number;
  oldNew?: [number, number];
  handler: () => void;
  CLNYBalance: number;
  isGamePage?: boolean;
  isAvailable?: string;
  isPlaced?: boolean;
  isActive?: boolean | null;
  levelsCount?: number;
  level?: number;
  isMobileView?: boolean;
  isPending?: boolean;
  isInitialLoad?: boolean;
};

export const Enhancement: React.FC<Props> = ({
  title,
  Image,
  aux,
  speed,
  finalText,
  getWhat,
  price,
  oldNew,
  handler,
  CLNYBalance,
  isGamePage,
  isAvailable,
  isPlaced,
  isActive,
  levelsCount,
  level = 0,
  isMobileView,
  isPending = false,
  isInitialLoad = false
}) => {
  const dispatch = useDispatch();
  const isReplaceMode = useSelector(isReplaceModeSelector);

  const availableButNotPlaced = useMemo(
    () => isGamePage && !!parseInt(isAvailable ?? '0') && !isPlaced,
    [isAvailable, isPlaced, isGamePage]
  );
  const notAvailableButNotPlaced = useMemo(
    () => isGamePage && !parseInt(isAvailable ?? '0') && !isPlaced,
    [isAvailable, isPlaced, isGamePage]
  );
  const isPlacedAndAvailable = useMemo(
    () => isGamePage && !!parseInt(isAvailable ?? '0') && isPlaced,
    [isAvailable, isPlaced, isGamePage]
  );

  const isFirstUpdate = isAvailable === '0';

  const getClnySpeedLabel = (val: string | number) => {
    if (NETWORK_DATA.ECONOMY !== 'fixed') {
      return `+ ${val} ${val > 1 ? 'shares' : 'share'}`;
    }
    return NETWORK_DATA.REVSHARE
      ? `Max + ${val} ${NETWORK_DATA.TOKEN_NAME}/day`
      : `+ ${val} ${NETWORK_DATA.TOKEN_NAME}/day`;
  };

  const getClnySpeedLevel = (val: string | number) => {
    if (NETWORK_DATA.ECONOMY !== 'fixed') {
      return `${val} ${val > 1 ? 'shares' : 'share'}`;
    }

    return NETWORK_DATA.REVSHARE ? (
      <>
        Max
        <br />
        {val} {NETWORK_DATA.TOKEN_NAME}/day
      </>
    ) : (
      `${val} ${NETWORK_DATA.TOKEN_NAME}/day`
    );
  };

  if (!isGamePage) {
    return (
      <EnhBlockMinifiedWrapper>
        <EnhImageWrapper
          minified={!NETWORK_DATA.IS_SIDEBAR_UPDATE}
          isActive={isActive ?? false}
        >
          <Image />
          <CounterBlockWrapper>
            {new Array(levelsCount).fill('').map((item, idx) => {
              return (
                <CounterBlock
                  key={`${idx}-${idx}`}
                  isActive={level >= idx + 1}
                />
              );
            })}
          </CounterBlockWrapper>
        </EnhImageWrapper>
        {NETWORK_DATA.IS_SIDEBAR_UPDATE && (
          <EhchSidebarWrapper>
            {Boolean(finalText) && <Ticked text={String(finalText)} />}

            {!finalText && (
              <EnhButton
                isGamePage={isGamePage}
                getWhat={getWhat}
                handler={handler}
                price={price}
                disabled={price > CLNYBalance}
                isPending={isPending || isInitialLoad}
              />
            )}
          </EhchSidebarWrapper>
        )}
      </EnhBlockMinifiedWrapper>
    );
  }

  return (
    <EnhancementItemWrapper isMobileView={isMobileView}>
      {aux && <EnhAux>{aux}</EnhAux>}
      <EnhImageWrapper>
        <Image />
      </EnhImageWrapper>
      <EnhTitle>{title}</EnhTitle>
      <div className="enh_speed">
        <>{getClnySpeedLevel(oldNew?.[0] ?? 0)}</>
      </div>
      {availableButNotPlaced && (
        <LandPlotEarnedButton
          disabled={isPending}
          isNewBuild={true}
          Width={'105px'}
          Height={'30px'}
          Padding={'0'}
          onClick={() => {
            dispatch(changeGameMode(GAME_VIEW_MODES.build));
            dispatch(selectObjectToSet(title));
          }}
        >
          <div className="enh_button__get">
            {isPending ? 'Pending...' : 'PLACE ON MAP'}
          </div>
        </LandPlotEarnedButton>
      )}
      {notAvailableButNotPlaced && (
        <LandPlotEarnedButton
          isNewBuild={true}
          disabled={price > CLNYBalance || isPending || isReplaceMode}
          Height={'30px'}
          Padding={'0'}
          Width={'105px'}
          mb={'2px'}
          onClick={() => {
            dispatch(changeGameMode(GAME_VIEW_MODES.build));
            dispatch(selectObjectToSet(title));
          }}
        >
          {isPending && <div className="enh_button__get">Pending...</div>}
          {!isPending && (
            <>
              <div className="enh_button__get">BUILD</div>
              <div className="enh_button__for">
                for {price} {NETWORK_DATA.TOKEN_NAME}
              </div>
            </>
          )}
          {price > CLNYBalance && (
            <EnhButtonError isDisabled={price < CLNYBalance} mt="-18px">
              not enough {NETWORK_DATA.TOKEN_NAME}
            </EnhButtonError>
          )}
        </LandPlotEarnedButton>
      )}

      <EnhButtonOuterWrapper isGamePage={isGamePage}>
        {Boolean(finalText) && isPlacedAndAvailable && (
          <Ticked text={String(finalText)} />
        )}
        {!finalText && !isFirstUpdate && !availableButNotPlaced && (
          <EnhButton
            isGamePage={isGamePage}
            getWhat={getWhat}
            handler={handler}
            price={price}
            disabled={price > CLNYBalance}
            isPending={isPending}
          />
        )}
      </EnhButtonOuterWrapper>
      {oldNew !== undefined && !availableButNotPlaced && !isPending && (
        <EnhOldNew>{getClnySpeedLabel(`${oldNew[1] - oldNew[0]}`)}</EnhOldNew>
      )}
    </EnhancementItemWrapper>
  );
};
