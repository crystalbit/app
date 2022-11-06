import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useLootboxes from '@features/lootboxes/hooks/useLootboxes';
import { METHODS_LABELS } from '@global/constants';
import { useBalance } from '@global/hooks/useBalance';
import useContracts from '@global/hooks/useContracts';
import useMetamask from '@global/hooks/useMetamask';
import usePersonalInfo from '@global/hooks/usePersonalInfo';
import { CONTRACT_METHODS, METAMASK_EVENTS } from '@global/types';
import { trackUserEvent } from '@global/utils/analytics';
import { userGearListSelector } from '@selectors/lootboxesSliceSelectors';
import { toggleGearPopup } from '@slices/appPartsSlice';
import { setCollectionLoader, setGearsList } from '@slices/lootboxesSlice';
import BN from 'bn.js';

export const useGears = () => {
  const dispatch = useDispatch();

  const { makeRequest } = useMetamask();
  const { address, web3Instance } = usePersonalInfo();
  const {
    gameManager,
    getGameManager,
    getGears,
    gears,
    avatarsManager,
    getAvatarsManager
  } = useContracts();
  const { getLootboxes } = useLootboxes();
  const { updateCLNYBalance, fetchUserBalance } = useBalance();

  const [isMintingLoad, setMintingLoad] = useState<string[]>([]);

  const userGears = useSelector(userGearListSelector);

  const getUserGears = async () => {
    let start = 0;
    let end = 99;
    let gearsRequestArray: [string[], string[]] = [[], []];
    let done: boolean = false;

    dispatch(setCollectionLoader(true));

    while (!done) {
      await makeRequest({
        address,
        type: METAMASK_EVENTS.call,
        onLoad: () => {},
        // eslint-disable-next-line no-loop-func
        onSuccess: (data: [string[], string[]]) => {
          if (data[0].length > 0) {
            gearsRequestArray[0].push(...data[0]);
            gearsRequestArray[1].push(...data[1]);
          } else {
            dispatch(setCollectionLoader(false));
            done = true;
          }
          start = end + 1;
          end = end + 100;
        },
        eventName: METHODS_LABELS.getUserGears,
        method: CONTRACT_METHODS.allMyTokensPaginate,
        contract: gears ?? getGears(),
        params: [start, end]
      });

      if (done) {
        break;
      }
    }
    dispatch(setGearsList(gearsRequestArray));
  };

  const openLootbox = async (
    tokenId: string,
    price: BN,
    callback?: () => unknown
  ) => {
    await makeRequest({
      address,
      type: METAMASK_EVENTS.send,
      onLoad: () => {
        setMintingLoad((tokens) => [...tokens, tokenId]);
      },
      onError: () => {
        trackUserEvent('Unlock crate failed');
        setMintingLoad((tokens) => tokens.filter((t) => t !== tokenId));
      },
      onSuccess: async () => {
        trackUserEvent('Unlock crate succeed');
        await getUserGears();
        await getLootboxes();
        await updateCLNYBalance(address);
        setMintingLoad((tokens) => tokens.filter((t) => t !== tokenId));
        dispatch(toggleGearPopup(true));
        callback?.();
      },
      eventName: METHODS_LABELS.gearOpen,
      method: CONTRACT_METHODS.openLootbox,
      contract: gameManager ?? getGameManager(),
      params: [tokenId, price]
    });
  };

  const getLastMintedGear = async (callback?: (data: any) => unknown) => {
    await makeRequest({
      address,
      type: METAMASK_EVENTS.call,
      onLoad: () => {},
      onError: () => {},
      onSuccess: (data) => {
        callback?.(data);
      },
      eventName: METHODS_LABELS.getLastOwnedToken,
      method: CONTRACT_METHODS.lastOwnedTokenURI,
      contract: gears ?? getGears(),
      params: []
    });
  };

  const lockItemGears = async (
    transportId: number,
    fGear: number,
    sGear: number,
    tGear: number,
    callback?: (data: any) => unknown,
    failCallback?: () => unknown
  ) => {
    await makeRequest({
      address,
      type: METAMASK_EVENTS.send,
      onLoad: () => {},
      onError: () => {
        failCallback?.();
      },
      onSuccess: (data) => {
        callback?.(data);
      },
      eventName: METHODS_LABELS.setGearLocks,
      method: CONTRACT_METHODS.setLocks,
      contract: avatarsManager ?? getAvatarsManager(),
      params: [transportId, fGear, sGear, tGear]
    });
  };

  const getLockedGears = async (
    callback?: (data: any) => unknown,
    failCallback?: () => unknown
  ) => {
    await makeRequest({
      address,
      type: METAMASK_EVENTS.call,
      onLoad: () => {},
      onError: () => {
        failCallback?.();
      },
      onSuccess: (data) => {
        callback?.(data);
      },
      eventName: METHODS_LABELS.setGearLocks,
      method: CONTRACT_METHODS.getLockedGears,
      contract: avatarsManager ?? getAvatarsManager(),
      params: [address]
    });
  };

  const getTransportCondition = async (
    callback?: (data: any) => unknown,
    failCallback?: () => unknown
  ) => {
    await makeRequest({
      address,
      type: METAMASK_EVENTS.call,
      onLoad: () => {},
      onError: () => {
        failCallback?.();
      },
      onSuccess: (data) => {
        callback?.(data);
      },
      eventName: METHODS_LABELS.setGearLocks,
      method: CONTRACT_METHODS.getTransportCondition,
      contract: avatarsManager ?? getAvatarsManager(),
      params: [address]
    });
  };

  const repairTransport = async (
    amount: number,
    callback?: (data: any) => unknown,
    failCallback?: () => unknown
  ) => {
    await makeRequest({
      address,
      type: METAMASK_EVENTS.send,
      onLoad: () => {},
      onError: () => {
        failCallback?.();
      },
      onSuccess: async () => {
        await fetchUserBalance(address, web3Instance);
        await updateCLNYBalance(address);
        await getTransportCondition(callback);
      },
      eventName: METHODS_LABELS.repairTransport,
      method: CONTRACT_METHODS.repairTransport,
      contract: gameManager ?? getGameManager(),
      params: [amount]
    });
  };

  return {
    openLootbox,
    isMintingLoad,
    userGears,
    getUserGears,
    getLastMintedGear,
    lockItemGears,
    getLockedGears,
    repairTransport,
    getTransportCondition
  };
};
