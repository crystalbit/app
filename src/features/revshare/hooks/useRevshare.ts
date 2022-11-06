import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import { trackUserEvent } from '@global/utils/analytics';
import { callWrapper, txWrapper } from '@global/utils/tx-wrapper';
import { CURRENT_CHAIN } from '@root//settings/chains';
import { NETWORK_DATA } from '@root/settings';
import { missionsManagerSelector } from '@selectors/commonAppSelectors';
import {
  missionLandRevshareSelector,
  personalRevshareSelector
} from '@selectors/questsSelectors';
import { addressSelector } from '@selectors/userStatsSelectors';
import {
  setMissionLandRevshare,
  setPersonalRevshare
} from '@slices/questSlice';
import mixpanel from 'mixpanel-browser';

export const useRevshare = () => {
  const dispatch = useDispatch();
  const mm = useSelector(missionsManagerSelector) ?? window.MM;
  const address = useSelector(addressSelector) ?? window.address;
  const [isPending, setIsPending] = useState<boolean>(false);
  const personalRevshare = useSelector(personalRevshareSelector) ?? '...';
  const missionLandRevshare = useSelector(missionLandRevshareSelector);
  const { addToast } = useToasts();

  const getPersonalRevshare = useCallback(() => {
    if (!address || !NETWORK_DATA.REVSHARE) return;
    callWrapper<string>(mm, {
      method: 'getRevshare',
      params: [address],
      from: address,
      type: CURRENT_CHAIN.x2,
      onFail() {
        addToast('Personal revshare fetch failed', { appearance: 'error' });
        mixpanel.track('Personal revshare fetch failed');
        console.log('Personal revshare fetch failed');
      }
    }).then((result) => {
      dispatch(setPersonalRevshare(result));
    });
  }, [address, mm]);

  const getRevshareByLandId = useCallback(
    (landsIds) => {
      if (!address) return;
      callWrapper<string>(mm, {
        method: 'getRevshareForLands',
        params: [landsIds],
        from: address,
        type: CURRENT_CHAIN.x2,
        onFail() {
          addToast('Land revshare fetch failed', { appearance: 'error' });
          mixpanel.track('Land revshare fetch failed');
        }
      }).then((result) => {
        dispatch(setMissionLandRevshare(result));
      });
    },
    [address, mm]
  );

  const setNewPersonalRevshareValue = useCallback(
    (amount, callback?: () => void) => {
      if (!address) return;

      const value = amount?.[0];

      trackUserEvent('Rev share clicked', { address });

      txWrapper(mm.methods.setAccountRevshare(value).send({ from: address }), {
        addToast,
        eventName: 'Set personal revshare value',
        chainData: CURRENT_CHAIN,
        onConfirm: () => {
          trackUserEvent('Rev share succeed', { address });
          dispatch(setPersonalRevshare(value));
          setIsPending(false);
          if (typeof callback === 'function') callback();
        },
        onFail: () => {
          trackUserEvent('Rev share failed', { address });
          setIsPending(false);
        },
        onPending: () => {
          setIsPending(true);
        }
      });
    },
    [address, mm]
  );

  const setLandsRevshares = (val: string[]) =>
    dispatch(setMissionLandRevshare(val));

  return {
    personalRevshare,
    missionLandRevshare,
    getPersonalRevshare,
    getRevshareByLandId,
    missionLandRevshareSelector,
    setLandsRevshares,
    setNewPersonalRevshareValue,
    isPending
  };
};
