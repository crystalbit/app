import React, { CSSProperties, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { UserAvatarUI } from '@features/avatars/components/userAvatarUI/userAvatarUI';
import { LandPlotEarnedButton } from '@features/lands/styles/landPlot.styles';
import { QuestScreen } from '@features/missions/components/quests/questScreen/questScreen';
import { StatsScreen } from '@features/missions/components/quests/statsScreen/statsScreen';
import { FLOW_STEPS, SUBSCREEN_STEPS } from '@features/missions/constants';
import useQuests from '@features/missions/hooks/useQuests';
import useConnection from '@global/hooks/useConnection';
import {
  NoAddressChangeWrapper,
  ParagraphQuests
} from '@global/styles/app.styles';
import { trackUserEvent } from '@global/utils/analytics';
import { ButtonsLayer } from '@root/features/missions/components/quests/buttonsLayer/buttonsLayer';
import {
  MainComputerScreenBlock,
  MainComputerWrapper,
  QuestsScreenButtonWrapper
} from '@root/features/missions/components/quests/questsScreen.styles';
import { CommonButton } from '@root/legacy/buttons/commonButton';
import { StyledTvImage } from '@root/legacy/xChange.styles';
import {
  isAvatarSelectMode,
  isAvatarsPopupOpened,
  userAvatarsSelector
} from '@selectors/avatarsSelectors';
import { addressSelector } from '@selectors/userStatsSelectors';
import { setFirstVisitFlow } from '@slices/avatarsSlice';
import {
  resetHistoryRecord,
  setDecryptSessionData,
  setUserAttempts
} from '@slices/decryptSlice';
import {
  setLastOwnedLootbox,
  toggleLootboxPopup
} from '@slices/lootboxesSlice';
import {
  changeQuestStep,
  changeSubScreenStep,
  setAnswerSignatureValue,
  setLeaveScreen,
  setQuestsRewards,
  setSelectedQuestItem
} from '@slices/questSlice';
import mixpanel from 'mixpanel-browser';

import QuestsUIScreen from '../images/photo/quests/mission-panel/missionsMainPanel.png';

const customButtonStyles: CSSProperties = {
  border: '2px solid #fe5161',
  background: 'black',
  color: '#fe5161',
  fontSize: '12px',
  minWidth: '190px',
  boxSizing: 'border-box'
};

export const QuestsPage = () => {
  const isConnected = useConnection(window.xweb3);
  const userAvatars = useSelector(userAvatarsSelector);
  const navigator = useNavigate();
  const address = useSelector(addressSelector);
  const isAvatarsPopup = useSelector(isAvatarsPopupOpened);
  const isAvatarSelectOpened = useSelector(isAvatarSelectMode);

  const dispatch = useDispatch();
  const { step } = useQuests();

  useEffect(() => {
    mixpanel.track('Quests page init', { address });
    if (Array.isArray(userAvatars) && !userAvatars?.length) {
      dispatch(setFirstVisitFlow(true));
    }
  }, [dispatch, userAvatars, address]);

  if (!isConnected) {
    mixpanel.track('Quests page init failed, not connected', { address });
    return (
      <NoAddressChangeWrapper>
        <ParagraphQuests fontSize={'26px'}>Loading...</ParagraphQuests>
      </NoAddressChangeWrapper>
    );
  }

  if (!address) {
    mixpanel.track('Quests page init failed, no address provided', { address });
    return (
      <NoAddressChangeWrapper>
        <p>Please connect your wallet first.</p>
        <LandPlotEarnedButton
          onClick={() => {
            trackUserEvent('Go back clicked');

            navigator(-1);
          }}
          Width={'fit-content'}
        >
          GO BACK
        </LandPlotEarnedButton>
      </NoAddressChangeWrapper>
    );
  }
  // return <QuestScreen />;
  return (
    <MainComputerWrapper>
      <QuestsScreenButtonWrapper>
        {step !== FLOW_STEPS.playCoding && step !== FLOW_STEPS.playDecrypt && (
          <CommonButton
            text="return to menu"
            onClick={() => {
              trackUserEvent('Go back clicked');

              dispatch(changeQuestStep(FLOW_STEPS.selectScreen));
              dispatch(changeSubScreenStep(SUBSCREEN_STEPS.preparing));
              dispatch(setQuestsRewards([]));
              dispatch(setAnswerSignatureValue(null));
              dispatch(setSelectedQuestItem(0));
              dispatch(setLeaveScreen(false));
              dispatch(toggleLootboxPopup(false));
              dispatch(setLastOwnedLootbox(null));
              dispatch(setUserAttempts(4));
              dispatch(setDecryptSessionData(null));
              dispatch(resetHistoryRecord());
              navigator('/play/0');
            }}
            disabled={false}
            isPending={false}
            style={customButtonStyles}
          />
        )}
      </QuestsScreenButtonWrapper>
      <MainComputerScreenBlock
        isPopupOpened={isAvatarsPopup || isAvatarSelectOpened}
      >
        <StyledTvImage src={QuestsUIScreen} />
        <ButtonsLayer />
        <QuestScreen />
        <StatsScreen />
        <UserAvatarUI isQuestsView />
      </MainComputerScreenBlock>
    </MainComputerWrapper>
  );
};
