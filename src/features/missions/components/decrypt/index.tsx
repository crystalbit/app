import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import TypeAnimation from 'react-type-animation';
import Ethereum from '@api/etheriumWeb3';
import QuestsBackend from '@api/questsBackend';
import { LeaveScreen } from '@features/missions/components/quests/codingQuest/leaveScreen';
import { FLOW_STEPS, SUBSCREEN_STEPS } from '@features/missions/constants';
import useDecrypt from '@features/missions/hooks/useDecrypt';
import {
  getMultipleRandom,
  getRandomInt,
  getRandomLetter,
  LETTERS,
  shuffle
} from '@features/missions/utils/decrytHelpers';
import { useActiveSignature } from '@global/hooks/useActiveSignature';
import { getSignMessage } from '@global/utils/signs';
import { NETWORK_DATA } from '@root/settings';
import { selectedAvatarSelector } from '@selectors/avatarsSelectors';
import { leaveScreenSelector } from '@selectors/questsSelectors';
import {
  addHistoryRecord,
  resetHistoryRecord,
  setDecryptSessionData,
  setUserAttempts
} from '@slices/decryptSlice';
import {
  changeQuestStep,
  changeSubScreenStep,
  setAnswerSignatureValue,
  setBackendData,
  setQuestsRewards
} from '@slices/questSlice';
import mixpanel from 'mixpanel-browser';

import {
  AttemptsIconsWrapper,
  DecryptCodeWrapper,
  DecryptItem,
  DecryptOuterWrapper,
  DecryptQuestCode,
  DecryptQuestTitle,
  DecryptQuestWrapper
} from './decrypt.styles';

export const DecryptScreen = () => {
  const dispatch = useDispatch();
  const attempts = useRef<number>(4);
  const selectedAvatar = useSelector(selectedAvatarSelector) ?? '';
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const isFailed = useRef<boolean>(false);
  const isCompleted = useRef<boolean>(false);
  const { words, textLinesCount, lettersPerLine, history } = useDecrypt();
  const params = useParams();
  const navigator = useNavigate();
  const { addToast } = useToasts();
  const { id: landId = '' } = params;
  const [activeSignature, setActiveSignature] = useState<{
    sign: string;
    data: string;
  } | null>(null);
  const isLeaveScreen = useSelector(leaveScreenSelector) ?? false;
  const { setDifferenceTime, saveLocalStorage } = useActiveSignature();

  const onRewardsSet = (data: { name: string; value: string }[]) =>
    dispatch(setQuestsRewards(data));
  const setAnswerSignature = (sig: { message: string; signature: string }) =>
    dispatch(setAnswerSignatureValue(sig));
  const onStepChange = (key: string) => dispatch(changeQuestStep(key));
  const onSubScreenStepChange = (key: string) =>
    dispatch(changeSubScreenStep(key));

  const failCallback = async (text: string, isRedirect: boolean = true) => {
    mixpanel.track('Decrypt mission failed', { address });

    addToast(text, {
      appearance: 'error'
    });
    isRedirect && setTimeout(() => navigator('/'), 2500);
    dispatch(changeQuestStep(FLOW_STEPS.selectScreen));

    if (activeSignature) {
      await QuestsBackend.leaveMission({
        message: activeSignature?.data,
        address: window.address ?? address,
        signature: activeSignature?.sign,
        missionId: 1,
        avatarId: +selectedAvatar,
        landId: +landId
      });
    }
  };

  useEffect(() => {
    mixpanel.track('Decrypt mission started', { address });
  }, []);

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
              mixpanel.track('Decrypt mission signature received', { address });
              saveLocalStorage(signature, data, address);
              setActiveSignature({
                sign: signature,
                data
              });
            } else {
              mixpanel.track('Decrypt mission signature not received', {
                address
              });
              setActiveSignature(null);
              dispatch(changeQuestStep(FLOW_STEPS.selectScreen));
            }
          })();
        } else if (signatureFlag.flag === null) {
          mixpanel.track('Decrypt quest signature not received', {
            address
          });
          setActiveSignature(null);
          dispatch(changeQuestStep(FLOW_STEPS.selectScreen));
        } else {
          mixpanel.track('Decrypt quest signature received', { address });
          setActiveSignature({
            sign: signatureFlag.signature,
            data: signatureFlag.data
          });
        }
      }
    }

    return () => {
      if (activeSignature && !isFailed.current && !isCompleted.current) {
        dispatch(setUserAttempts(4));
        dispatch(setDecryptSessionData(null));
        dispatch(resetHistoryRecord());
        QuestsBackend.leaveMission({
          message: activeSignature?.data,
          address: window.address ?? address,
          signature: activeSignature?.sign,
          missionId: 1,
          avatarId: +selectedAvatar,
          landId: +landId
        });
      }
    };
  }, [
    activeSignature,
    landId,
    selectedAvatar,
    isFailed.current,
    isCompleted.current
  ]);

  useEffect(() => {
    if (activeSignature?.sign && activeSignature?.data) {
      (async () => {
        try {
          const response = await QuestsBackend.startDecryptMission({
            message: activeSignature.data,
            address: window.address ?? address,
            signature: activeSignature.sign,
            missionId: 1,
            avatarId: +selectedAvatar,
            landId: +landId
          });

          if (response.success) {
            dispatch(
              setBackendData({
                message: activeSignature.data,
                address: window.address ?? address,
                signature: activeSignature.sign
              })
            );
            dispatch(setDecryptSessionData({ ...response }));
          } else {
            await failCallback(
              response.message ||
                'Error when starting mission, please try again',
              false
            );
            dispatch(changeQuestStep(FLOW_STEPS.selectScreen));
          }
        } catch {
          await failCallback(
            'Error when starting mission, please try again',
            false
          );
          dispatch(changeQuestStep(FLOW_STEPS.selectScreen));
        }
      })();
    }
  }, [activeSignature, address, navigator]);

  const attemptsIcons = useMemo(
    () =>
      new Array(attempts.current)
        .fill('')
        .map((_) => ' ⬛ ')
        .join(' '),
    [attempts.current]
  );

  const makeUIRow = useCallback(
    (word: string | null, idx: number) => {
      const lettersInRow: string[] = [];
      const linePosition = getRandomInt(0, lettersPerLine - 5);
      let isWordSet = false;

      if (word?.length) {
        while (lettersInRow.join('').length < lettersPerLine) {
          if (lettersInRow.join('').length >= linePosition && !isWordSet) {
            lettersInRow.push(word);
            isWordSet = true;
          } else {
            lettersInRow.push(getRandomLetter(LETTERS));
          }
        }
      } else {
        while (lettersInRow.join('').length < lettersPerLine) {
          lettersInRow.push(getRandomLetter(LETTERS));
        }
      }

      return (
        <div key={idx}>
          {lettersInRow.map((part, idx) => (
            <DecryptItem
              key={`${part}-${idx}`}
              onMouseEnter={() => setSelectedWord(part)}
              onClick={async () => {
                if (!activeSignature || !words.includes(part)) return false;
                try {
                  const data = await QuestsBackend.checkDecryptWord({
                    message: activeSignature?.data ?? '',
                    address: window.address ?? address,
                    signature: activeSignature?.sign ?? '',
                    word: part,
                    missionId: 1,
                    avatarId: +selectedAvatar,
                    landId: +landId
                  });

                  if (data.hasOwnProperty('errors')) {
                    return failCallback('Decrypt check failed', false);
                  }

                  const getActualCount = (attempts: number) => {
                    const attemptsToSet = attempts > 0 ? attempts - 1 : 0;
                    if (attemptsToSet === 0 && activeSignature) {
                      isFailed.current = true;
                      addToast('Decrypt mission failed, please try again', {
                        appearance: 'error'
                      });
                      mixpanel.track(
                        'Decrypt mission failed, attempts are over',
                        { address }
                      );
                      setTimeout(() => {
                        dispatch(changeQuestStep(FLOW_STEPS.selectScreen));
                        dispatch(setUserAttempts(4));
                        dispatch(setDecryptSessionData(null));
                      }, 1000);
                    }
                    return attemptsToSet;
                  };

                  if (
                    (data.hasOwnProperty('status') &&
                      data.status !== 'complete') ||
                    (data.hasOwnProperty('isPassword') && !data.isPassword) ||
                    (data.hasOwnProperty('success') && !data.success)
                  ) {
                    attempts.current = getActualCount(attempts.current);
                    dispatch(
                      addHistoryRecord([
                        `> Entry Denied. ${data.similarity} correct`,
                        `> ${part.toUpperCase()}`
                      ])
                    );
                  } else {
                    isCompleted.current = true;
                    mixpanel.track('Decrypt mission completed', { address });

                    setAnswerSignature({
                      signature: data.signature,
                      message: data.message
                    });
                    onRewardsSet(data?.data);
                    onStepChange(FLOW_STEPS.success);
                    onSubScreenStepChange(SUBSCREEN_STEPS.success);
                    dispatch(setUserAttempts(4));
                    dispatch(setDecryptSessionData(null));
                    dispatch(resetHistoryRecord());
                  }
                } catch (error: any) {
                  await failCallback(
                    `Decrypt check failed ${error.message ?? ''}`,
                    false
                  );
                }
              }}
            >
              {part}
            </DecryptItem>
          ))}
        </div>
      );
    },
    [lettersPerLine, activeSignature, attempts, words]
  );

  const decryptUI = useMemo(() => {
    if (!words.length) return null;
    const wordsToSet = shuffle(Array.from(words));
    const range = new Array(textLinesCount).fill('').map((_, idx) => idx);
    const requiredIndexes = getMultipleRandom(range, wordsToSet.length).sort(
      (a, b) => a - b
    );

    const isLineWithWord = (idx: number) => requiredIndexes.includes(idx);

    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {new Array(textLinesCount).fill('').map((_, idx) => {
          return makeUIRow(
            isLineWithWord(idx) ? wordsToSet.pop() ?? null : null,
            idx
          );
        })}
      </div>
    );
  }, [words]);

  const suggestedWord = useMemo(
    () => (
      <TypeAnimation
        cursor={true}
        sequence={[selectedWord ?? '_', 300]}
        wrapper="span"
        repeat={1}
      />
    ),
    [selectedWord]
  );

  if (isLeaveScreen) return <LeaveScreen />;

  return (
    <DecryptOuterWrapper>
      <DecryptQuestWrapper>
        <DecryptQuestTitle>
          <TypeAnimation
            cursor={false}
            sequence={[
              `MARSCOLONY CORP. (TM) ${NETWORK_DATA.CHAIN} PROTOCOL`,
              1000
            ]}
            wrapper="span"
            repeat={1}
          />
        </DecryptQuestTitle>
        <DecryptQuestTitle>
          <TypeAnimation
            cursor={false}
            sequence={['Enter password:', 1000]}
            wrapper="span"
            repeat={1}
          />
        </DecryptQuestTitle>
        <DecryptQuestTitle>
          {`Attempts remaining: ${attempts.current}`}
          <AttemptsIconsWrapper>{attemptsIcons}</AttemptsIconsWrapper>
        </DecryptQuestTitle>
        {!activeSignature && (
          <DecryptQuestTitle>Sign message in metamask</DecryptQuestTitle>
        )}
        <DecryptQuestCode>{decryptUI}</DecryptQuestCode>
      </DecryptQuestWrapper>
      <DecryptCodeWrapper>
        {history.map((items) => {
          return (
            <>
              <DecryptQuestCode>{items[0]}</DecryptQuestCode>
              <DecryptQuestCode>{items[1]}</DecryptQuestCode>
            </>
          );
        })}
        <DecryptQuestCode>{suggestedWord}</DecryptQuestCode>
      </DecryptCodeWrapper>
    </DecryptOuterWrapper>
  );
};
