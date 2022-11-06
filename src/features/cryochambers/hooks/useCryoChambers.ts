import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import { trackUserEvent } from '@global/utils/analytics';
import { formatRequestWrapperPayload } from '@global/utils/gas';
import { txWrapper } from '@global/utils/tx-wrapper';
import { CURRENT_CHAIN } from '@root/settings/chains';
import { userAvatarsSelector } from '@selectors/avatarsSelectors';
import { cryoManagerSelector } from '@selectors/commonAppSelectors';
import {
  cryochambersStateSelector,
  frozenAvasSelector,
  xpBonusesSelector
} from '@selectors/cryochambersSelectors';
import { addressSelector } from '@selectors/userStatsSelectors';
import {
  setChambersState,
  setFrozenItems,
  setXPBonuses
} from '@slices/cryochambersSlice';
import useMetamask from '@features/global/hooks/useMetamask';

const useCryoChambers = () => {
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const { makeCallRequest } = useMetamask();
  const address = useSelector(addressSelector) ?? window.address;
  const userAvatars = useSelector(userAvatarsSelector) ?? [];
  const ch = useSelector(cryoManagerSelector) ?? window.CH;
  const cryoChamberInfo = useSelector(cryochambersStateSelector);
  const frozenAvas = useSelector(frozenAvasSelector);
  const xpBonuses = useSelector(xpBonusesSelector);
  const isCryoChamberAvailable = cryoChamberInfo?.isSet === true;
  const [isBuyProcess, setIsBuyProcess] = useState(false);

  const getChambersInfo = useCallback(() => {
    makeCallRequest<string>({
      contract: ch,
      method: 'cryochambers',
      params: [address],
      address,
      errorText: 'Cryochambers info fetch failed'
    }).then((result) => {
      dispatch(setChambersState(result));
    });
  }, [address, ch, dispatch]);

  const buyCryochamber = useCallback(async () => {
    trackUserEvent('Buy training center clicked');
    const payload = await formatRequestWrapperPayload(address);
    setIsBuyProcess(true);
    txWrapper(window.GM.methods.purchaseCryochamber().send({ ...payload }), {
      addToast,
      eventName: 'Purchase cryochamber',
      chainData: CURRENT_CHAIN,
      onConfirm: async () => {
        trackUserEvent('Buy training center succeed');
        setIsBuyProcess(false);
        await getChambersInfo();
        await window?.updateCLNY(address);
      },
      onFail: () => {
        setIsBuyProcess(false);
        trackUserEvent('Buy training center failed');
      },
      onPending: () => {}
    });
  }, [addToast, getChambersInfo]);

  const buyCryochamberEnergy = useCallback(
    async (amount: string | number) => {
      const payload = await formatRequestWrapperPayload(address);
      trackUserEvent(`Claim ${amount} fuel rod clicked`);
      txWrapper(
        window.GM.methods
          .purchaseCryochamberEnergy(amount)
          .send({ ...payload }),
        {
          addToast,
          eventName: 'Buy cryochamber energy',
          chainData: CURRENT_CHAIN,
          onConfirm: async () => {
            trackUserEvent(`Claim ${amount} fuel rod succeed`);
            await getChambersInfo();
            await window?.updateCLNY(address);
          },
          onFail: () => {
            trackUserEvent(`Claim ${amount} fuel rod failed`);
          },
          onPending: () => {}
        }
      );
    },
    [addToast, getChambersInfo]
  );

  const getFrozenItems = useCallback(
    (avas: string[]) => {
      makeCallRequest<string>({
        contract: ch,
        method: 'isInCryoChamber',
        params: [avas],
        address,
        errorText: 'Frozen avatars fetch failed'
      }).then((result) => {
        dispatch(setFrozenItems(result));
      });
    },
    [address, ch, dispatch]
  );

  const getExpectedXPBonus = useCallback(() => {
    makeCallRequest<string>({
      contract: ch,
      method: 'bulkEstimateXpAddition',
      params: [userAvatars],
      address,
      errorText: 'XP bonuses fetch failed'
    }).then((result) => {
      dispatch(setXPBonuses(result));
    });
  }, [address, ch, dispatch, userAvatars]);

  const setAvasToCryo = useCallback(
    async (avas: (string | number)[], callback?: () => void) => {
      const payload = await formatRequestWrapperPayload(address);
      txWrapper(
        window.CH.methods.putAvatarsInCryochamber(avas).send({ ...payload }),
        {
          addToast,
          eventName: 'Set avatars to cryochamber',
          chainData: CURRENT_CHAIN,
          onConfirm: async () => {
            trackUserEvent('Put in chamber succeed', {
              avatars: avas
            });
            await getFrozenItems(userAvatars);
            await getChambersInfo();
            await getExpectedXPBonus();
            callback?.();
          },
          onFail: () => {
            trackUserEvent('Put in chamber failed', {
              avatars: avas
            });
            callback?.();
          },
          onPending: () => {}
        }
      );
    },
    [addToast, getChambersInfo, getExpectedXPBonus, getFrozenItems, userAvatars]
  );

  return {
    cryoChamberInfo,
    isCryoChamberAvailable,
    getChambersInfo,
    buyCryochamber,
    buyCryochamberEnergy,
    frozenAvas,
    getFrozenItems,
    setAvasToCryo,
    getExpectedXPBonus,
    xpBonuses,
    isBuyProcess
  };
};

export default useCryoChambers;
