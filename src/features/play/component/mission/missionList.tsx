import React, { useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import QuestsBackend from '@api/questsBackend';
import { FLOW_STEPS, QUEST_TYPES } from '@features/missions/constants';
import useQuests from '@features/missions/hooks/useQuests';
import { capitalizeFirstLetter } from '@features/missions/utils/helpers';
import { PrepareModal } from '@features/play/component/mission/miningQuest/prepareModal';
import useMining from '@features/play/hooks/useMining';
import { Loader } from '@global/components/loader/loader';
import useEventListener from '@global/hooks/useEventTriggers';
import usePersonalInfo from '@global/hooks/usePersonalInfo';
import { trackUserEvent } from '@global/utils/analytics';
import { extractURLParam } from '@global/utils/urlParams';
import {
  selectedAvatarSelector,
  userAvatarsSelector
} from '@selectors/avatarsSelectors';
import { avatarsMissionsLimitsSelector } from '@selectors/userStatsSelectors';
import { setSelectedAvatar } from '@slices/avatarsSlice';
import { toggleMiningPrepareScreenState } from '@slices/questSlice';

import { UserAvatarUI } from '../avatars/missionAvatar/userAvatarUI';

import {
  AvatarWrapper,
  Block,
  BlockMission,
  BlockTitle,
  BottomPlayBtnMsg,
  Content,
  ContentMission,
  ContentProperty,
  ContentTitle,
  ErrorMsgMission,
  List,
  MissionBlock,
  MissionBlockChallenge,
  MissionContent,
  MissionContentTable,
  MissionMainContent,
  MissionPlayBlock,
  MissionTableHead,
  MissionToPlay,
  MissionWrapper,
  MissionWrapperBlock,
  MobileMissionWrapper,
  PlayButton,
  PropertyMissionTable,
  Text,
  TitleMissionPlay,
  TitleMissionTable,
  TitleMobileMission
} from './missionList.styles';

type QuestsListProps = {
  items: {
    value: any;
    isActive: boolean;
    key: string;
    customAction?: boolean;
  }[];
};

const MissionList = ({ items }: QuestsListProps) => {
  const {
    onQuestSelect,
    onStepChange,
    onMenuHandle,
    activeMenuItem,
    setActiveMenuItem
  } = useQuests();

  const { isInitialized } = usePersonalInfo();

  const { isMiningPrepareScreen, toggleMiningPrepare } = useMining();

  useEventListener('keydown', onMenuHandle);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const selectedAvatar = useSelector(selectedAvatarSelector);
  const userAvatars = useSelector(userAvatarsSelector);
  const isLoading = useSelector(avatarsMissionsLimitsSelector) === null;

  useEffect(() => {
    const toggleNeeded = extractURLParam(location, 'withToggle');

    if (toggleNeeded) {
      toggleMiningPrepare(true);
    }
  }, [location]);

  const onMiningMissionClick = () => {
    dispatch(toggleMiningPrepareScreenState(true));
  };

  const onListItemClick = async ({
    isActive,
    key,
    customAction
  }: {
    key: string;
    isActive: boolean;
    customAction?: boolean;
  }) => {
    if (!isActive) return;

    trackUserEvent(`${capitalizeFirstLetter(key)} quest  clicked`);

    if (!customAction) {
      onQuestSelect(key);
      onStepChange(FLOW_STEPS.instructions);
      const data = await QuestsBackend.getRandomLand({
        address: window.address
      });
      if (data?.landId) {
        navigate(`/missions/${data?.landId}`);
      }
    }

    switch (key) {
      case QUEST_TYPES.mining:
        return onMiningMissionClick();
      default:
        return;
    }
  };

  const avatarToDisplay = useMemo(() => {
    if (selectedAvatar && userAvatars?.includes(selectedAvatar))
      return selectedAvatar;
    if (userAvatars?.length) {
      localStorage.setItem(
        'selectedAvatar',
        userAvatars[userAvatars.length - 1]
      );
      dispatch(setSelectedAvatar(userAvatars[userAvatars.length - 1]));
      return userAvatars[userAvatars.length - 1];
    }
    return '';
  }, [selectedAvatar, userAvatars, dispatch]);

  const avatarsLimits = useSelector(avatarsMissionsLimitsSelector);
  const availableMissions = avatarsLimits?.[avatarToDisplay] ?? 0;

  const refMis = useRef<HTMLDivElement>(null);

  const handleClick = async () => {
    await onListItemClick({
      isActive: items[activeMenuItem].isActive,
      key: items[activeMenuItem].key,
      customAction: items[activeMenuItem].customAction
    });
  };

  const isButtonDisabled = availableMissions === 0;

  if (isMiningPrepareScreen) return <PrepareModal />;

  return (
    <>
      <MobileMissionWrapper
        marginTop={
          userAvatars === null || userAvatars.length === 0 ? '180px' : '100px'
        }
      >
        <BlockMission>
          <AvatarWrapper>
            {!isLoading && <UserAvatarUI />}
            {isLoading && <Loader />}
          </AvatarWrapper>
          {userAvatars === null || userAvatars.length === 0 ? null : (
            <MissionWrapperBlock>
              <BlockTitle>
                <TitleMobileMission>CHOOSE THE MISSION</TitleMobileMission>
              </BlockTitle>

              <MissionContent>
                {items.map(({ value, isActive, key, customAction }, idx) => (
                  <MissionBlockChallenge
                    isActive={isActive}
                    isHighlighted={activeMenuItem === idx}
                    key={key}
                    onClick={() =>
                      onListItemClick({ key, isActive, customAction })
                    }
                  >
                    <ContentMission>
                      <Content>
                        <Text>MISSION</Text>
                        <Text>{value.name}</Text>
                      </Content>
                      <Content>
                        <Text>DIFFICULTY</Text>
                        <Text>{value.difficulty}</Text>
                      </Content>
                      <Content>
                        <Text>REWARD</Text>
                        <Text>{value.reward}</Text>
                      </Content>
                      <Content>
                        <Text>PROFESSION</Text>
                        <Text>{value.profession}</Text>
                      </Content>
                    </ContentMission>
                  </MissionBlockChallenge>
                ))}
              </MissionContent>
            </MissionWrapperBlock>
          )}
        </BlockMission>
      </MobileMissionWrapper>

      <MissionWrapper>
        <MissionBlock>
          <MissionMainContent>
            <Block Width="40%">
              {!isLoading && <UserAvatarUI />}
              {isLoading && isInitialized && <Loader />}
            </Block>

            <Block Width="100%">
              <MissionPlayBlock>
                <TitleMissionPlay>Choose the mission</TitleMissionPlay>
                <MissionToPlay>
                  <MissionTableHead>
                    <TitleMissionTable>
                      <span>Mission</span>
                    </TitleMissionTable>
                    <PropertyMissionTable>
                      <span>Difficulty</span>
                      <span>Rewards</span>
                      <span>Profession</span>
                    </PropertyMissionTable>
                  </MissionTableHead>

                  <MissionContentTable>
                    {items.map(
                      ({ value, isActive, key, customAction }, idx) => (
                        <List
                          ref={refMis}
                          isActive={isActive}
                          isHighlighted={activeMenuItem === idx}
                          key={key}
                          onClick={() => {
                            if (activeMenuItem !== idx) {
                              setActiveMenuItem(idx);
                            }
                          }}
                        >
                          <ContentTitle>
                            <span>{value.name}</span>
                          </ContentTitle>
                          <ContentProperty>
                            <span>{value.difficulty}</span>
                            <span>{value.reward}</span>
                            <span>{value.profession}</span>
                          </ContentProperty>
                        </List>
                      )
                    )}
                  </MissionContentTable>
                </MissionToPlay>
              </MissionPlayBlock>
            </Block>
          </MissionMainContent>
          <BottomPlayBtnMsg>
            <PlayButton
              onClick={handleClick}
              countMis={availableMissions}
              disabled={availableMissions === 0}
            >
              Play
            </PlayButton>
            {isButtonDisabled ? (
              <ErrorMsgMission>
                {!isInitialized
                  ? 'Connect your wallet first'
                  : isLoading
                  ? 'Loading...'
                  : 'No missions available. Come back later'}
              </ErrorMsgMission>
            ) : null}
          </BottomPlayBtnMsg>
        </MissionBlock>
      </MissionWrapper>
    </>
  );
};

export { MissionList };
