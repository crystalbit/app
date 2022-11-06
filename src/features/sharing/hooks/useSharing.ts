import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { METHODS_LABELS } from '@global/constants';
import useContracts from '@global/hooks/useContracts';
import useFlags from '@global/hooks/useFlags';
import useMetamask from '@global/hooks/useMetamask';
import usePersonalInfo from '@global/hooks/usePersonalInfo';
import { CONTRACT_METHODS, METAMASK_EVENTS } from '@global/types';
import { trackUserEvent } from '@global/utils/analytics';
import { isPrivateAddressSelector } from '@selectors/appPartsSelectors';
import { setAccountPublicity } from '@slices/appPartsSlice';

const useSharing = () => {
  const dispatch = useDispatch();
  const isAccountPrivate = useSelector(isPrivateAddressSelector);
  const { address } = usePersonalInfo();
  const { makeRequest } = useMetamask();
  const { isMissionsAvailable } = useFlags();
  const { missionsManager, getMissionsManager } = useContracts();
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (!isMissionsAvailable || !address) return;

    makeRequest({
      address,
      type: METAMASK_EVENTS.call,
      contract: missionsManager ?? getMissionsManager(),
      method: CONTRACT_METHODS.accountMissionState,
      errorText: 'Fail when fetching publicity status',
      params: [address],
      eventName: METHODS_LABELS.accountMissionState,
      onError: () => {},
      onSuccess: (data) => {
        dispatch(setAccountPublicity(data.isAccountPrivate));
      },
      onLoad: () => {}
    }).then(() => {});
  }, [address, isMissionsAvailable]);

  const onPrivacyToggleChange = async () => {
    if (isPending || !address?.length) return;
    trackUserEvent('Lands sharing clicked', { address });
    await makeRequest({
      address,
      type: METAMASK_EVENTS.send,
      contract: missionsManager ?? getMissionsManager(),
      method: CONTRACT_METHODS.setAccountPrivacy,
      params: [!isAccountPrivate],
      eventName: METHODS_LABELS.landSharing,
      onError: () => {
        trackUserEvent('Lands sharing failed', {
          address,
          status: !isAccountPrivate
        });
        dispatch(setAccountPublicity(isAccountPrivate));
        setIsPending(false);
      },
      onSuccess: () => {
        trackUserEvent('Lands sharing succeed', {
          address,
          status: !isAccountPrivate
        });
        dispatch(setAccountPublicity(!isAccountPrivate));
        setIsPending(false);
      },
      onLoad: () => {
        setIsPending(true);
      }
    });
  };

  return {
    isAccountPrivate,
    onPrivacyToggleChange,
    isTogglerPending: isPending
  };
};

export default useSharing;
