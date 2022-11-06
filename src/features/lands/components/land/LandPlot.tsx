import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { KEY_OBJECTS } from '@features/game/constants/gameObjects';
import { GameLandPlot } from '@features/lands/components/gameLand/GameLandPlot';
import { OLD_NEW, PRICES } from '@features/lands/constants';
import { EnhancementsListWrapper } from '@features/lands/styles/landPlot.styles';
import { navigateToGlobeLand } from '@features/lands/utils/globusNavigation';
import useGameManagement from '@global/hooks/useGameManagement';
import useLandStats from '@global/hooks/useLandStats';
import useMediaQuery from '@global/hooks/useMediaQuery';
import useRoutes from '@global/hooks/useRoutes';
import { trackUserEvent } from '@global/utils/analytics';
import { BaseStationIcon } from '@images/icons/BaseStationIcon';
import { Power } from '@images/icons/Power';
import { RobotAssembly } from '@images/icons/RobotAssembly';
import { Transport } from '@images/icons/Transport';
import { Enhancement } from '@root/legacy/enhancement/Enhancement';

import { LandPlotNew } from './LandPlotNew';

type Props = {
  id: number;
  CLNYBalance: number;
  trigger: boolean;
  isDefaultOpen?: boolean;
  missionsLimit?: number | string;
  isCartItem?: boolean;
  onCartItemRemove?: () => void;
};

export const LandPlot: React.FC<Props> = ({
  id,
  CLNYBalance,
  trigger,
  missionsLimit,
  isCartItem,
  onCartItemRemove
}) => {
  const navigator = useNavigate();
  const isMobile = useMediaQuery('(max-width: 1200px)');
  const { isGamePage } = useRoutes();

  const {
    earned,
    earningSpeed,
    hasBaseStation,
    isInitialLoad,
    isBuyProcess,
    build,
    powerProductionLevel,
    robotAssemblyLevel,
    transportLevel,
    updateEarned
  } = useLandStats(isCartItem, id);

  const {
    isBaseAvailable,
    isBasePlaced,
    isTransportAvailable,
    isRobotAvailable,
    isTransportPlaced,
    isPowerplantPlaced,
    isPowerplantAvailable,
    isRobotPlaced,
    isBuildPending
  } = useGameManagement();

  React.useEffect(() => {
    if (trigger || isCartItem) return;
    updateEarned().then(() => {});
  }, [trigger]);

  const enhancementsItemsList = useMemo(
    () => (
      <EnhancementsListWrapper
        isBottomBlock={isGamePage}
        isMobileView={isMobile}
      >
        <Enhancement
          isInitialLoad={isInitialLoad}
          Image={BaseStationIcon}
          title="Base Station"
          speed={hasBaseStation ? 1 : undefined}
          finalText={hasBaseStation ? 'Claimed' : undefined}
          getWhat=""
          price={30}
          oldNew={
            !hasBaseStation
              ? [0, 1]
              : [1, 1] /* if has BS -> no level upping then */
          }
          handler={() => build.base()}
          CLNYBalance={CLNYBalance}
          isGamePage={isGamePage}
          isAvailable={isBaseAvailable}
          isPlaced={isBasePlaced}
          isActive={hasBaseStation}
          level={hasBaseStation ? 1 : 0}
          levelsCount={1}
          isMobileView={isMobile}
          isPending={
            isBuildPending === KEY_OBJECTS.base ||
            isBuyProcess === KEY_OBJECTS.base
          }
        />
        <Enhancement
          isInitialLoad={isInitialLoad}
          Image={RobotAssembly}
          title="Robot Assembly"
          aux={`lvl${robotAssemblyLevel}/3`}
          speed={robotAssemblyLevel ? robotAssemblyLevel + 1 : undefined}
          finalText={robotAssemblyLevel === 3 ? 'Max LVL' : undefined}
          getWhat={`LVL ${robotAssemblyLevel + 1}`}
          price={PRICES[robotAssemblyLevel + 1]}
          oldNew={OLD_NEW[robotAssemblyLevel] as [number, number] | undefined}
          handler={() => build.robots(robotAssemblyLevel + 1)}
          CLNYBalance={CLNYBalance}
          isGamePage={isGamePage}
          isAvailable={isRobotAvailable}
          isPlaced={isRobotPlaced}
          isActive={Boolean(robotAssemblyLevel && robotAssemblyLevel > 0)}
          level={robotAssemblyLevel}
          levelsCount={3}
          isMobileView={isMobile}
          isPending={
            isBuildPending === KEY_OBJECTS.robot ||
            isBuyProcess === KEY_OBJECTS.robot
          }
        />
        <Enhancement
          isInitialLoad={isInitialLoad}
          Image={Transport}
          title="Transport"
          aux={`lvl${transportLevel}/3`}
          speed={transportLevel ? transportLevel + 1 : undefined}
          finalText={transportLevel === 3 ? 'Max LVL' : undefined}
          getWhat={`LVL ${transportLevel + 1}`}
          price={PRICES[transportLevel + 1]}
          oldNew={OLD_NEW[transportLevel] as [number, number] | undefined}
          handler={() => build.transport(transportLevel + 1)}
          CLNYBalance={CLNYBalance}
          isGamePage={isGamePage}
          isAvailable={isTransportAvailable}
          isPlaced={isTransportPlaced}
          isActive={Boolean(transportLevel && transportLevel > 0)}
          level={transportLevel}
          levelsCount={3}
          isMobileView={isMobile}
          isPending={
            isBuildPending === KEY_OBJECTS.transport ||
            isBuyProcess === KEY_OBJECTS.transport
          }
        />
        <Enhancement
          isInitialLoad={isInitialLoad}
          Image={Power}
          title="Power Production"
          aux={`lvl${powerProductionLevel}/3`}
          speed={powerProductionLevel ? powerProductionLevel + 1 : undefined}
          finalText={powerProductionLevel === 3 ? 'Max LVL' : undefined}
          getWhat={`LVL ${powerProductionLevel + 1}`}
          price={PRICES[powerProductionLevel + 1]}
          oldNew={OLD_NEW[powerProductionLevel] as [number, number] | undefined}
          handler={() => build.power(powerProductionLevel + 1)}
          CLNYBalance={CLNYBalance}
          isGamePage={isGamePage}
          isAvailable={isPowerplantAvailable}
          isPlaced={isPowerplantPlaced}
          isActive={Boolean(powerProductionLevel && powerProductionLevel > 0)}
          levelsCount={3}
          level={powerProductionLevel}
          isMobileView={isMobile}
          isPending={
            isBuildPending === KEY_OBJECTS.power ||
            isBuyProcess === KEY_OBJECTS.power
          }
        />
      </EnhancementsListWrapper>
    ),
    [
      isInitialLoad,
      isBuyProcess,
      isGamePage,
      hasBaseStation,
      robotAssemblyLevel,
      transportLevel,
      powerProductionLevel,
      isBaseAvailable,
      isBasePlaced,
      isTransportAvailable,
      isRobotAvailable,
      isTransportPlaced,
      isPowerplantPlaced,
      isPowerplantAvailable,
      isRobotPlaced,
      CLNYBalance,
      isMobile,
      isBuildPending
    ]
  );

  if (isGamePage) {
    return (
      <GameLandPlot
        id={id}
        earningSpeed={earningSpeed}
        earned={earned}
        enhancements={enhancementsItemsList}
      />
    );
  }

  return (
    <LandPlotNew
      hasBaseStation={hasBaseStation}
      powerProductionLevel={powerProductionLevel}
      transportLevel={transportLevel}
      id={id}
      onCartItemRemove={onCartItemRemove}
      isCartItem={isCartItem}
      enhancements={enhancementsItemsList}
      missions={missionsLimit}
      clny={earned}
      earningSpeed={earningSpeed}
      onLandNavigate={() => {
        trackUserEvent('Enter the landscape clicked', { landId: id });
        navigator(`/game?id=${id}`);
      }}
      onMapSearch={(event: MouseEvent) => {
        trackUserEvent('Land point on globe clicked');
        navigateToGlobeLand(event, id);
      }}
    />
  );
};
