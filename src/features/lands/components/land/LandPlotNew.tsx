import React, { useMemo } from 'react';
import {
  EnhancementsBlock,
  InfoBlock,
  InfoMissionBlockHover,
  InfoMissionHoverText,
  LandPlotEnhancementsBlock,
  LandPlotNewIconWrapper,
  LandPlotNewImageWrapper,
  LandPlotNewName,
  LandPlotNewStatItem,
  LandPlotNewStatValue,
  LandPlotOuterWrapper,
  LandPlotStatHeader,
  LandPlotStatsBlock,
  LandPlotTitleLine
  //TimerCLNYInfo,
  //TimerInfoBlock
} from '@features/lands/styles/landPlotNew.styles';
import { MOBILE_BREAKPOINT } from '@global/constants';
import useFlags from '@global/hooks/useFlags';
import useMediaQuery from '@global/hooks/useMediaQuery';
import { generateBlockie } from '@global/utils/blockie.canvas';
import { LandPinIcon } from '@images/icons/LandPinIcon';
import { LandPlotNavigateIcon } from '@images/icons/LandPlotNavigateIcon';
import { Info } from '@images/icons/sidebarIcons/Info';
import { NETWORK_DATA } from '@root/settings';

export const LandPlotNew = ({
  hasBaseStation,
  powerProductionLevel,
  transportLevel,
  id,
  enhancements,
  onMapSearch,
  onLandNavigate,
  missions,
  clny,
  earningSpeed
}: any) => {
  const { isMissionsAvailable, isGameFunctionality } = useFlags();
  const isMobile = useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT}px)`);

  const getClnySpeedLabel = (val: string | number) => {
    return NETWORK_DATA.ECONOMY === 'fixed'
      ? `Max ${val} ${NETWORK_DATA.TOKEN_NAME}/day`
      : `${earningSpeed} ${earningSpeed === 1 ? 'share' : 'shares'}`;
  };

  const maxBaseMissions = useMemo(() => {
    if (hasBaseStation === 0) return 0;
    if (hasBaseStation === 1 && powerProductionLevel === 0) {
      return 1;
    } else {
      return powerProductionLevel + hasBaseStation;
    }
  }, [powerProductionLevel, hasBaseStation]);

  const controlsBlock = useMemo(() => {
    return (
      <>
        <LandPlotNewIconWrapper>
          <div onClick={onMapSearch}>
            <LandPinIcon className="with-fill" />
          </div>
        </LandPlotNewIconWrapper>
        {isGameFunctionality && (
          <LandPlotNewIconWrapper>
            <div onClick={onLandNavigate}>
              <LandPlotNavigateIcon />
            </div>
          </LandPlotNewIconWrapper>
        )}
      </>
    );
  }, [isGameFunctionality, id]);

  return (
    <LandPlotOuterWrapper isMobile={isMobile}>
      <LandPlotNewImageWrapper>
        <img
          src={generateBlockie(id).toDataURL()}
          alt={'Land Plot #' + id.toString()}
        />
      </LandPlotNewImageWrapper>
      <LandPlotEnhancementsBlock>
        <LandPlotTitleLine>
          <LandPlotNewName>Land #{id}&nbsp;</LandPlotNewName>
          {controlsBlock}
        </LandPlotTitleLine>
        <EnhancementsBlock>{enhancements ?? null}</EnhancementsBlock>
      </LandPlotEnhancementsBlock>
      <LandPlotStatsBlock isMobile={isMobile}>
        <LandPlotNewStatItem direction="row">
          <LandPlotNewStatValue>
            {`+ ${clny} ${NETWORK_DATA.TOKEN_NAME}`}
            {/*<TimerInfoBlock>*/}
            {/*  <Info />*/}
            {/*</TimerInfoBlock>*/}
            {/*<TimerCLNYInfo>*/}
            {/*  <InfoMissionHoverText>72:33:59 left till</InfoMissionHoverText>*/}
            {/*  <InfoMissionHoverText>cutting rewards twice</InfoMissionHoverText>*/}
            {/*</TimerCLNYInfo>*/}
          </LandPlotNewStatValue>
          <LandPlotStatHeader>
            {`${
              NETWORK_DATA.ECONOMY === 'fixed'
                ? getClnySpeedLabel(earningSpeed ?? '...')
                : `${earningSpeed ?? '...'} ${
                    earningSpeed === 1 ? 'share' : 'shares'
                  }`
            }`}
          </LandPlotStatHeader>
        </LandPlotNewStatItem>
        {isMissionsAvailable && (
          <LandPlotNewStatItem>
            <LandPlotNewStatValue>
              {missions.limits === undefined
                ? '...'
                : `${missions.limits} + ${missions.limits2} missions
                  `}
            </LandPlotNewStatValue>
            {missions.limits === undefined ? null : (
              <InfoBlock>
                <Info />
              </InfoBlock>
            )}
            <InfoMissionBlockHover>
              <InfoMissionHoverText>
                {missions.limits} of {maxBaseMissions} base missions
              </InfoMissionHoverText>
              <InfoMissionHoverText>
                {missions.limits2 < 0 ? 0 : missions.limits2} of{' '}
                {transportLevel === 0 ? transportLevel : 1} mining missions
              </InfoMissionHoverText>
            </InfoMissionBlockHover>
          </LandPlotNewStatItem>
        )}
      </LandPlotStatsBlock>
    </LandPlotOuterWrapper>
  );
};
