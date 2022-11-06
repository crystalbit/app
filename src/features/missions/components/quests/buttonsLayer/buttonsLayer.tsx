import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import QuestsBackend from '@api/questsBackend';
import { useAvatars } from '@avatars/hooks/useAvatars';
import useMetamask from '@features/global/hooks/useMetamask';
import useLootboxes from '@features/lootboxes/hooks/useLootboxes';
import {
  FLOW_STEPS,
  QUEST_TYPES,
  SUBSCREEN_STEPS
} from '@features/missions/constants';
import useQuests from '@features/missions/hooks/useQuests';
import { screenButtons } from '@features/missions/utils/helpers';
import { signatureToVrs } from '@global/utils/signatureToVrs';
import CommonGreenButton from '@images/photo/quests/buttons/common-green-button.png';
import CommonYellowButton from '@images/photo/quests/buttons/common-yellow-button.png';
import TriangleGreenButton from '@images/photo/quests/buttons/triangle-green-button.png';
import TriangleRedButton from '@images/photo/quests/buttons/triangle-red-button.png';
import WideGreenButton from '@images/photo/quests/buttons/wide-green-button.png';
import CommonRedButton from '@images/photo/quests/buttons/сommon-red-button.png';
import { store } from '@redux/store';
import { NETWORK_DATA } from '@root/settings';
import {
  selectedAvatarSelector,
  userAvatarsSelector
} from '@selectors/avatarsSelectors';
import {
  backendDataSelector,
  leaveScreenSelector,
  missionRewardsSelector
} from '@selectors/questsSelectors';
import { addressSelector, tokensSelector } from '@selectors/userStatsSelectors';
import {
  setAvatarsXPList,
  switchAvatarsSelectMode
} from '@slices/avatarsSlice';
import {
  resetHistoryRecord,
  setDecryptSessionData,
  setUserAttempts
} from '@slices/decryptSlice';
import { setLootboxesList } from '@slices/lootboxesSlice';
import {
  changeQuestStep,
  changeSubScreenStep,
  setActiveQuest,
  setAnswerSignatureValue,
  setBackendData,
  setLeaveScreen,
  setQuestsRewards,
  setSelectedQuestItem
} from '@slices/questSlice';
import {
  setAvatarsMissionsLimits,
  setLandsMissionsLimits
} from '@slices/userStatsSlice';
import mixpanel from 'mixpanel-browser';

import { ScreenButton } from './screenButton';

const coords = [
  { top: 610, left: 200 },
  { top: 684, left: 673 },
  { top: 684, left: 856 },
  { top: 686, left: 1038 },
  { top: 604, left: 1555 }
];

const questsTypes: string[] = ['coding', 'encrypt'];

const buttonToImageMapper = (template: string) => {
  switch (template) {
    case 'triangle-red-button':
      return TriangleRedButton;
    case 'wide-green-button':
      return WideGreenButton;
    case 'common-yellow-button':
      return CommonYellowButton;
    case 'triangle-green-button':
      return TriangleGreenButton;
    case 'common-red-button':
      return CommonRedButton;
    case 'common-green-button':
      return CommonGreenButton;
    default:
      return '';
  }
};

export const ButtonsLayer: React.FC = () => {
  const { step, activeQuest, subScreenStep } = useQuests();
  const { id: landId } = useParams();
  const { makeCallRequest } = useMetamask();
  const tokens = useSelector(tokensSelector);
  const avatars = useSelector(userAvatarsSelector);
  const address = useSelector(addressSelector);
  const dispatch = useDispatch();
  const { getAvatarsXP } = useAvatars();
  const { getLastMintedLootbox, togglePopup } = useLootboxes();
  const navigate = useNavigate();
  const isLeaveScreen = useSelector(leaveScreenSelector) ?? false;
  const backendData = useSelector(backendDataSelector) ?? false;
  const rewards = useSelector(missionRewardsSelector) ?? [];
  const [isClaiming, setIsClaiming] = useState(false);
  const { makeSendRequest } = useMetamask();
  const selectedAvatar = useSelector(selectedAvatarSelector) ?? '';

  const isLootboxesFunc = NETWORK_DATA.LOOTBOXES;

  const callbacks = {
    selectScreen: [
      () => {
        mixpanel.track('Avatars select popup clicked on missions screen', {
          address
        });
        store.dispatch(switchAvatarsSelectMode(true));
      },
      () => {},
      async () => {
        mixpanel.track('Start mission button click', {
          address
        });

        const data = await QuestsBackend.getRandomLand({
          address: window.address
        });

        if (data?.landId) {
          mixpanel.track('Start mission button click success', {
            address,
            randomLandId: data?.landId
          });
          navigate(`/missions/${data?.landId}`);
        }
      },
      () => {
        const selectedQuestItem = store.getState()?.quests?.questsListItem ?? 0;
        if (selectedQuestItem === 0) {
          dispatch(setActiveQuest(questsTypes[selectedQuestItem]));
          mixpanel.track('Coding quest selected as active mission', {
            address
          });
          dispatch(changeQuestStep(FLOW_STEPS.instructions));
        }
      },
      () => {}
    ],
    instructions: [
      () => {
        mixpanel.track('Avatars select popup clicked on missions screen', {
          address
        });
        dispatch(switchAvatarsSelectMode(true));
      },
      () => dispatch(changeQuestStep(FLOW_STEPS.selectScreen)),
      () => {},
      () => {
        mixpanel.track('Mission start button pressed', {
          address
        });
        store.dispatch(
          changeQuestStep(
            activeQuest === 'coding'
              ? FLOW_STEPS.playCoding
              : FLOW_STEPS.playDecrypt
          )
        );
      },
      () => {}
    ],
    playCoding: [
      () => {},
      async () => {
        if (isLeaveScreen) {
          mixpanel.track('User left a coding mission', {
            address
          });
          const userAvatars = avatars ?? [];
          if (backendData && landId !== undefined) {
            const { address, signature, message } = backendData;
            await QuestsBackend.leaveMission({
              address,
              message,
              signature,
              missionId: 1,
              avatarId: +selectedAvatar,
              landId: +landId
            });
          }
          dispatch(changeQuestStep(FLOW_STEPS.selectScreen));
          dispatch(setActiveQuest(null));
          dispatch(setLeaveScreen(false));
          dispatch(setBackendData(null));
          setTimeout(async () => {
            const limits = await QuestsBackend.getLimits({
              landIds: tokens ?? [],
              avatarIds: userAvatars
            });
            dispatch(setLandsMissionsLimits(limits?.lands));
            dispatch(setAvatarsMissionsLimits(limits?.avatars));
          }, 5000);
          return;
        }
        mixpanel.track('Coding mission leave button pressed', {
          address
        });
        dispatch(setLeaveScreen(true));
      },
      () => {},
      () => {
        mixpanel.track('User closed the leave screen', {
          address
        });
        dispatch(setLeaveScreen(false));
      },
      () => {}
    ],
    playDecrypt: [
      () => {},
      async () => {
        if (isLeaveScreen) {
          mixpanel.track('User left a decrypt mission', {
            address
          });
          const userAvatars = avatars ?? [];
          dispatch(changeQuestStep(FLOW_STEPS.selectScreen));
          dispatch(setActiveQuest(null));
          dispatch(setLeaveScreen(false));
          dispatch(setBackendData(null));
          dispatch(setUserAttempts(4));
          dispatch(setDecryptSessionData(null));
          dispatch(resetHistoryRecord());
          setTimeout(async () => {
            const limits = await QuestsBackend.getLimits({
              landIds: tokens ?? [],
              avatarIds: userAvatars
            });
            dispatch(setLandsMissionsLimits(limits?.lands));
            dispatch(setAvatarsMissionsLimits(limits?.avatars));
          }, 5000);
          return;
        }
        mixpanel.track('Decrypt mission leave button pressed', {
          address
        });
        dispatch(setLeaveScreen(true));
      },
      () => {},
      () => {
        mixpanel.track('User closed the leave screen', {
          address
        });
        dispatch(setLeaveScreen(false));
      },
      () => {}
    ],
    success: [
      () => {},
      () => {},
      () => {},
      () => {},
      async () => {
        if (isClaiming) return;
        mixpanel.track('Claim reward button clicked', {
          address
        });

        if (NETWORK_DATA.IS_HARMONY_TEST_METRICS) {
          window.dataLayer.push({
            event: 'claimXPStart',
            address
          });
        }

        const dataToParse = store?.getState()?.quests?.answerSignature ?? {
          signature: '',
          message: ''
        };
        const { signature, message } = dataToParse;
        const { s, r, v } = signatureToVrs(signature);

        makeSendRequest({
          contract: window.GM,
          method: 'finishMission',
          params: [message, v, r, s],
          address,
          eventName: 'Mission reward claiming',
          onError() {
            if (NETWORK_DATA.IS_HARMONY_TEST_METRICS) {
              window.dataLayer.push({
                event: 'claimXPFail',
                address
              });
            }
            setIsClaiming(false);
          },
          onLoad() {
            setIsClaiming(true);
          },
          onSuccess() {
            mixpanel.track(
              activeQuest === QUEST_TYPES.coding
                ? 'Coding mission rewards received'
                : 'Decrypt mission rewards received',
              {
                address
              }
            );

            if (NETWORK_DATA.IS_HARMONY_TEST_METRICS) {
              window.dataLayer.push({
                event: 'claimXPSuccess',
                address
              });
            }
            setIsClaiming(false);
            const userAvatars = avatars ?? [];

            setTimeout(async () => {
              const limits = QuestsBackend.getLimits({
                landIds: tokens ?? [],
                avatarIds: userAvatars
              });

              const exp = getAvatarsXP(userAvatars);

              const [limitsData, expData] = await Promise.all([limits, exp]);

              dispatch(setLandsMissionsLimits(limitsData?.lands));
              dispatch(setAvatarsMissionsLimits(limitsData?.avatars));
              dispatch(
                setAvatarsXPList(
                  userAvatars.reduce(
                    (acc: Record<string, any>, i: string, idx: number) => {
                      acc[i] = expData[idx];
                      return acc;
                    },
                    {}
                  )
                )
              );
              dispatch(changeQuestStep(FLOW_STEPS.restart));
              dispatch(changeSubScreenStep(SUBSCREEN_STEPS.restart));

              if (rewards.some((r) => r.type === 'accent') && isLootboxesFunc) {
                await getLastMintedLootbox();

                makeCallRequest<unknown[]>({
                  contract: window.LB,
                  method: 'allMyTokensPaginate',
                  params: [0, 1000],
                  address,
                  errorText: 'Error getting owned lootboxes list'
                }).then((lootboxes) => {
                  dispatch(setLootboxesList(lootboxes));
                });

                dispatch(togglePopup(true));
              }
            }, 3000);
          }
        });
      }
    ],
    restart: [
      () => {},
      () => {},
      () => {},
      async () => {
        mixpanel.track('Restart mission button clicked', {
          address
        });
        const userAvatars = avatars ?? [];

        dispatch(changeQuestStep(FLOW_STEPS.selectScreen));
        dispatch(changeSubScreenStep(SUBSCREEN_STEPS.preparing));
        dispatch(setQuestsRewards([]));
        dispatch(setAnswerSignatureValue(null));
        dispatch(setSelectedQuestItem(0));
        dispatch(setLeaveScreen(false));
        dispatch(setUserAttempts(4));
        dispatch(setDecryptSessionData(null));
        dispatch(resetHistoryRecord());

        const limits = await QuestsBackend.getLimits({
          landIds: tokens ?? [],
          avatarIds: userAvatars
        });

        dispatch(setLandsMissionsLimits(limits?.lands));
        dispatch(setAvatarsMissionsLimits(limits?.avatars));

        const data = await QuestsBackend.getRandomLand({
          address: window.address,
          excludedLandId: parseInt(landId ?? '0')
        });

        if (data.landId) navigate(`/missions/${data.landId}`);
        else navigate('/');
      },
      () => {}
    ]
  };

  const buttons = useMemo(() => {
    return screenButtons([])[step]?.map((i, idx) =>
      i.disabled ? null : (
        <ScreenButton
          image={buttonToImageMapper(`${i.type}-${i.color}-button`)}
          type={i.type}
          key={`${i.color}${idx}`}
          text={i.text}
          color={i.color}
          coords={coords[idx]}
          leftSwing={i.left}
          // @ts-ignore
          callback={callbacks?.[step]?.[idx]}
        />
      )
    );
  }, [callbacks, step, isLeaveScreen, subScreenStep]);
  return <div>{buttons}</div>;
};
