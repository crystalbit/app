import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import QuestsBackend from '@api/questsBackend';
import { FLOW_STEPS } from '@features/missions/constants';
import { trackUserEvent } from '@global/utils/analytics';
import {
  activeQuestSelector,
  questStepSelector,
  subScreenStepSelector
} from '@selectors/questsSelectors';
import {
  changeQuestStep,
  changeSubScreenStep,
  setActiveQuest,
  setAnswerSignatureValue,
  setQuestsRewards,
  setSelectedQuestItem
} from '@slices/questSlice';

const useQuests = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const step = useSelector(questStepSelector);
  const activeQuest = useSelector(activeQuestSelector);
  const subScreenStep = useSelector(subScreenStepSelector);
  const [activeMenuItem, setActiveMenuItem] = useState(0);

  const { pathname } = useLocation();

  const itemsCount = useMemo(() => {
    // Depends on actual MISSIONS_LIST length
    if (step === FLOW_STEPS.selectScreen) return 3;
    else return 0;
  }, [step]);

  const onQuestSelect = (key: string) => dispatch(setActiveQuest(key));
  const onStepChange = (key: string) => dispatch(changeQuestStep(key));
  const onSubScreenStepChange = (key: string) =>
    dispatch(changeSubScreenStep(key));
  const onRewardsSet = (data: { name: string; value: string }[]) =>
    dispatch(setQuestsRewards(data));
  const setAnswerSignature = (sig: { message: string; signature: string }) =>
    dispatch(setAnswerSignatureValue(sig));

  const onMenuHandle = useCallback(
    (e: KeyboardEvent) => {
      if (e.keyCode === 40 && activeMenuItem < itemsCount - 1) {
        e.preventDefault();
        setActiveMenuItem(activeMenuItem + 1);
        dispatch(setSelectedQuestItem(activeMenuItem + 1));
        e.preventDefault();
      } else if (e.keyCode === 38 && activeMenuItem > 0) {
        e.preventDefault();
        setActiveMenuItem(activeMenuItem - 1);
        dispatch(setSelectedQuestItem(activeMenuItem - 1));
        e.preventDefault();
      } else return;
    },
    [activeMenuItem, itemsCount, dispatch]
  );

  useEffect(() => {
    setTimeout(() => setActiveMenuItem(0), 500);
  }, [step, activeQuest, pathname]);

  const startRandomLand = async () => {
    trackUserEvent('Start mission button click', { address });

    const data = await QuestsBackend.getRandomLand({
      address: window.address
    });

    if (data?.landId) {
      trackUserEvent('Start mission button click success', {
        address,
        randomLandId: data?.landId
      });

      navigate(`/missions/${data?.landId}`);
    }
  };

  return {
    step,
    subScreenStep,
    activeQuest,
    onQuestSelect,
    onStepChange,
    onSubScreenStepChange,
    onRewardsSet,
    setAnswerSignature,
    onMenuHandle,
    activeMenuItem,
    startRandomLand,
    setActiveMenuItem
  };
};

export default useQuests;
