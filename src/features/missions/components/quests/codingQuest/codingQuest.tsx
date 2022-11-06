import React, { useEffect, useState } from 'react';
// @ts-ignore
import { usePageVisibility } from 'react-page-visibility';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import Ethereum from '@api/etheriumWeb3';
import QuestsBackend from '@api/questsBackend';
import { FLOW_STEPS, SUBSCREEN_STEPS } from '@features/missions/constants';
import useQuests from '@features/missions/hooks/useQuests';
import { useActiveSignature } from '@global/hooks/useActiveSignature';
import useTimer from '@global/hooks/useTimer';
import { getSignMessage } from '@global/utils/signs';
import { selectedAvatarSelector } from '@selectors/avatarsSelectors';
import { leaveScreenSelector } from '@selectors/questsSelectors';
import { addressSelector } from '@selectors/userStatsSelectors';
import { changeQuestStep, setBackendData } from '@slices/questSlice';
import mixpanel from 'mixpanel-browser';

import CodeScreen from '../../typer/CodeScreen';
import { QuestAdditionalText } from '../questAdditionalText/questAdditionalText';
import { ParagraphText } from '../questsScreen.styles';
import { QuestsTitle } from '../title/questsTitle';

import { LeaveScreen } from './leaveScreen';

export const CodingQuest = () => {
  const dispatch = useDispatch();
  const [activeSignature, setActiveSignature] = useState<{
    sign: string;
    data: string;
  } | null>(null);
  const [isMissionStarted, setMissionStarted] = useState<boolean>(false);
  const {
    onStepChange,
    onSubScreenStepChange,
    onRewardsSet,
    setAnswerSignature
  } = useQuests();
  const params = useParams();
  const { addToast } = useToasts();
  const address = useSelector(addressSelector);
  const navigator = useNavigate();
  const selectedAvatar = useSelector(selectedAvatarSelector) ?? '';
  const isLeaveScreen = useSelector(leaveScreenSelector) ?? false;
  const isVisible = usePageVisibility();

  const { id: landId = '' } = params;

  const failCallback = (text: string, isRedirect: boolean = true) => {
    mixpanel.track('Coding quest failed', { address });

    addToast(text, {
      appearance: 'error'
    });
    isRedirect && setTimeout(() => navigator('/'), 2500);
    dispatch(changeQuestStep(FLOW_STEPS.selectScreen));
  };

  const { setDifferenceTime, saveLocalStorage } = useActiveSignature();

  useEffect(() => {
    if (activeSignature === null) {
      if (landId && selectedAvatar) {
        const signatureFlag = setDifferenceTime(landId, selectedAvatar);

        if (signatureFlag.flag) {
          (async () => {
            const data = getSignMessage(landId, selectedAvatar);
            if (!data) return;
            const signature = await Ethereum.getEthSignature(data);

            if (typeof signature === 'string') {
              mixpanel.track('Coding quest signature received', { address });
              saveLocalStorage(signature, data, address);
              setActiveSignature({
                sign: signature,
                data
              });
            } else {
              mixpanel.track('Coding quest signature not received', {
                address
              });
              setActiveSignature(null);
              dispatch(changeQuestStep(FLOW_STEPS.selectScreen));
            }
          })();
        } else if (signatureFlag.flag === null) {
          mixpanel.track('Coding quest signature not received', {
            address
          });
          setActiveSignature(null);
          dispatch(changeQuestStep(FLOW_STEPS.selectScreen));
        } else {
          mixpanel.track('Coding quest signature received', { address });
          setActiveSignature({
            sign: signatureFlag.signature,
            data: signatureFlag.data
          });
        }
      }
    }
  }, [activeSignature, landId, selectedAvatar, address]);

  useEffect(() => {
    if (activeSignature?.sign && activeSignature?.data) {
      (async () => {
        try {
          const response = await QuestsBackend.startCodingMission({
            message: activeSignature.data,
            address: window.address ?? address,
            signature: activeSignature.sign,
            missionId: 0,
            avatarId: +selectedAvatar,
            landId: +landId
          });

          if (response.success) {
            mixpanel.track('Coding quest started', { address });
            setMissionStarted(true);
            dispatch(
              setBackendData({
                message: activeSignature.data,
                address: window.address ?? address,
                signature: activeSignature.sign
              })
            );
          } else {
            failCallback(
              response.message ||
                'Error when starting mission, please try again',
              false
            );
            dispatch(changeQuestStep(FLOW_STEPS.selectScreen));
          }
        } catch {
          mixpanel.track('Coding quest start failed', { address });
          setMissionStarted(false);
          failCallback('Error when starting mission, please try again', false);
          dispatch(changeQuestStep(FLOW_STEPS.selectScreen));
        }
      })();
    }
  }, [activeSignature, address, navigator]);

  useEffect(() => {
    if (isMissionStarted && activeSignature?.data && activeSignature?.sign) {
      let pingPusher = setInterval(async () => {
        if (isVisible || true) {
          // better handle
          const response = await QuestsBackend.pingCodingMission({
            message: activeSignature.data,
            address: window.address ?? address,
            signature: activeSignature.sign,
            missionId: 0,
            avatarId: +selectedAvatar,
            landId: +landId
          });

          if (response.status === 400 || response.status === 401) {
            clearInterval(pingPusher);
            failCallback(
              response.message ||
                'Error when pinging backend, please restart the mission',
              false
            );
            mixpanel.track('Coding quest, error when pinging backend', {
              address
            });
            dispatch(changeQuestStep(FLOW_STEPS.selectScreen));
          }

          if (response.status === 'complete') {
            mixpanel.track('Coding quest completed', { address });
            clearInterval(pingPusher);
            setAnswerSignature({
              signature: response.signature,
              message: response.message
            });
            onRewardsSet(response?.data);

            onStepChange(FLOW_STEPS.success);
            onSubScreenStepChange(SUBSCREEN_STEPS.success);
          }
        }
      }, 10000);
      return () => {
        clearInterval(pingPusher);
        dispatch(setBackendData(null));
      };
    }
  }, [activeSignature, address, isMissionStarted, isVisible, dispatch]);

  const timer = useTimer({
    initialMinute: 1,
    initialSeconds: 0,
    successCallback: () => {},
    isStarted: isMissionStarted
  });

  if (isLeaveScreen) return <LeaveScreen />;

  return (
    <>
      <QuestsTitle text={`Time left: ${timer}`} />
      <QuestAdditionalText
        text={
          <>
            <ParagraphText marginBottom={'10px'}>Hacking started</ParagraphText>

            <ParagraphText>
              Begin mashing buttons to start coding.
            </ParagraphText>
          </>
        }
      />
      <CodeScreen />
    </>
  );
};
