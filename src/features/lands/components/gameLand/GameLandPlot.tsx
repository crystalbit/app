import React, { ReactElement, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  GamePageDetailedButton,
  GamePageDetailedInfo,
  GamePageDetailedMeta,
  GamePageDetailedPlotWrapper,
  GamePageDetailedStats,
  GamePageEnhancementsOverlay,
  LandPlotDescriptionB,
  LandPlotEarned,
  LandPlotEarnedButton,
  LandPlotEarnedText,
  LandPlotImageWrapper,
  LandPlotLink,
  MainDetailedPlotWrapper
} from '@features/lands/styles/landPlot.styles';
import { getClnySpeedLabel } from '@features/lands/utils/formating';
import useGameManagement from '@global/hooks/useGameManagement';
import useMediaQuery from '@global/hooks/useMediaQuery';
import useRoutes from '@global/hooks/useRoutes';
import { generateBlockie } from '@global/utils/blockie.canvas';
import { ArrowDown } from '@images/icons/ArrowDown';
import { NETWORK_DATA } from '@root/settings';
import {
  changeGameMode,
  GAME_VIEW_MODES,
  selectObjectToSet
} from '@slices/gameManagementSlice';
import mixpanel from 'mixpanel-browser';

type GameLandPlotType = {
  id: number;
  enhancements: ReactElement;
  earningSpeed: number | string;
  earned: string;
};

export const GameLandPlot = ({
  id,
  enhancements,
  earningSpeed,
  earned
}: GameLandPlotType) => {
  const dispatch = useDispatch();
  const { isGamePage } = useRoutes();
  const { isGameRepaintMode } = useGameManagement();
  const isMobile = useMediaQuery('(max-width: 1200px)');

  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (isGamePage && isGameRepaintMode) {
      setOpened(false);
    }
  }, [isGamePage, isGameRepaintMode]);

  return (
    <MainDetailedPlotWrapper>
      <GamePageDetailedPlotWrapper isOpened={opened}>
        <GamePageDetailedMeta>
          <LandPlotImageWrapper isGamePage={isGamePage}>
            <img
              src={generateBlockie(id).toDataURL()}
              alt={'Land Plot #' + id.toString()}
            />
          </LandPlotImageWrapper>
          <GamePageDetailedInfo>
            <LandPlotLink isGamePage={isGamePage}>
              Land #{id}&nbsp;
            </LandPlotLink>
            <GamePageDetailedStats>
              <LandPlotDescriptionB marginTop={15} isGamePage={isGamePage}>
                {Boolean(earningSpeed) && (
                  <>
                    {NETWORK_DATA.ECONOMY === 'fixed'
                      ? getClnySpeedLabel(earningSpeed)
                      : `${earningSpeed} ${
                          earningSpeed === 1 ? 'share' : 'shares'
                        }`}
                  </>
                )}
                {!earningSpeed && 'Loading...'}
              </LandPlotDescriptionB>
              <LandPlotEarned isGamePage={isGamePage}>
                Earned:{' '}
                <LandPlotEarnedText isGamePage={isGamePage}>
                  {Boolean(earned)
                    ? `${earned} ${NETWORK_DATA.TOKEN_NAME}`
                    : 'Loading...'}
                </LandPlotEarnedText>
              </LandPlotEarned>
            </GamePageDetailedStats>
          </GamePageDetailedInfo>
        </GamePageDetailedMeta>
        <GamePageDetailedButton>
          <LandPlotEarnedButton
            onClick={(e) => {
              e.stopPropagation();
              mixpanel.track('Build mode triggered', { landId: id });
              setOpened(!opened);
              if (opened) {
                dispatch(changeGameMode(GAME_VIEW_MODES.navigation));
                dispatch(selectObjectToSet(null));
                setOpened(false);
              }
            }}
          >
            Build
            <ArrowDown upside={!opened} />
          </LandPlotEarnedButton>
        </GamePageDetailedButton>
        {opened && (
          <GamePageEnhancementsOverlay
            isMobile={isMobile}
            onMouseEnter={() => {
              dispatch(changeGameMode(GAME_VIEW_MODES.navigation));
              dispatch(selectObjectToSet(null));
            }}
          >
            {enhancements}
          </GamePageEnhancementsOverlay>
        )}
      </GamePageDetailedPlotWrapper>
    </MainDetailedPlotWrapper>
  );
};
