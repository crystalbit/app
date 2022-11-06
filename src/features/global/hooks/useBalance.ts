import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import { useAvatars } from '@avatars/hooks/useAvatars';
import { freeReserve } from '@features/globus/utils/reserveHelper';
import {
  BUNCH_SIZE,
  EARNED_AMOUNT_CHECK_TICK,
  LOCAL_STORAGE_KEYS,
  METHODS_LABELS
} from '@global/constants';
import useContracts from '@global/hooks/useContracts';
import useFlags from '@global/hooks/useFlags';
import useMetamask from '@global/hooks/useMetamask';
import {
  CONTRACT_METHODS,
  METAMASK_EVENTS,
  TOASTS_APPEARANCE
} from '@global/types';
import {
  logDevInfo,
  setFBPixel,
  trackGoogleAnalyticsEvent,
  trackUserEvent
} from '@global/utils/analytics';
import { EMPTY_ADDRESS } from '@global/utils/etc';
import {
  isCollectingSelector,
  isLoadingTokensSelector
} from '@redux/selectors/commonAppSelectors';
import Ethereum from '@root/api/etheriumWeb3';
import QuestsBackend from '@root/api/questsBackend';
import { NETWORK_DATA } from '@root/settings';
import { CURRENT_CHAIN } from '@root/settings/chains';
import { cartItemsSelector } from '@selectors/cartSliceSelectors';
import {
  addressSelector,
  clnyBalanceSelector,
  earnedAmountSelector,
  earnSpeedSelector,
  mintedTokensSelector,
  tokensSelector,
  userBalanceSelector
} from '@selectors/userStatsSelectors';
import {
  setAvatarsNamesList,
  setAvatarsXPList,
  setSelectedAvatar,
  setUserAvatarsList
} from '@slices/avatarsSlice';
import { resetCart, setClaimingCartStatus } from '@slices/cartSlice';
import {
  setGameManager,
  setInitialized,
  setIsCollecting,
  setIsLoading
} from '@slices/commonAppStateSlice';
import { setRepaintMode } from '@slices/gameManagementSlice';
import {
  resetMintedTokens,
  setAddress,
  setAvatarsMissionsLimits,
  setColonyBalance,
  setEarnedAmount,
  setEarnSpeed,
  setLandsMissionsLimits,
  setMintedTokens,
  setUserBalance,
  setUserTokens
} from '@slices/userStatsSlice';
import Web3 from 'web3';
import { fromWei } from 'web3-utils';

export const useBalance = () => {
  const { makeRequest, makeSendRequest } = useMetamask();
  const { isMissionsAvailable, isAvatarsAvailable, isSelectedAvatar } =
    useFlags();
  const {
    getCLNYManager,
    clnyManager,
    gameManager,
    getGameManager,
    getAvatarsManager,
    mcManager,
    getMCManager,
    lootboxesManager
  } = useContracts();

  // BALANCE ITEMS
  const clnyBalance = useSelector(clnyBalanceSelector);
  const userBalance = useSelector(userBalanceSelector);
  const plotTokens = useSelector(tokensSelector);
  const tokens = useSelector(tokensSelector);
  const isLoadingTokens = useSelector(isLoadingTokensSelector);

  const earnedAmount = useSelector(earnedAmountSelector);
  const speed = useSelector(earnSpeedSelector);

  // GLOBAL BALANCE
  const allMintedTokens = useSelector(mintedTokensSelector);

  // APP PARTS
  const userAddress = useSelector(addressSelector);
  const isCartOpened = useSelector(cartItemsSelector);
  const isCollectInProgress = useSelector(isCollectingSelector);

  // FEATURES
  const { getUserAvatars, getAvatarsXP, getAvatarsNames, calculateAvatarsXP } =
    useAvatars();

  // UTILS
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const softTimer = React.useRef<NodeJS.Timeout>();

  const updateCLNYBalance = React.useCallback(
    async (address) => {
      makeRequest({
        type: METAMASK_EVENTS.call,
        address,
        method: CONTRACT_METHODS.balanceOf,
        params: [address],
        contract: clnyManager ?? getCLNYManager(),
        onSuccess: (balance) => {
          if (balance !== undefined) {
            const _clnyBalance = +fromWei(balance, 'ether');
            if (clnyBalance !== _clnyBalance) {
              dispatch(setColonyBalance(_clnyBalance));
            }
          }
        }
      });
    },
    [dispatch, clnyBalance, clnyManager]
  );

  const updateEarnedAll = React.useCallback(async () => {
    if (!gameManager) return;
    const allTokens = Array.from(plotTokens ?? []).flat();

    let bunch: string[] = [];
    let earnedAmount = 0;
    let earnSpeed = 0;
    for (let i = 0; i < allTokens.length; i++) {
      bunch.push(allTokens[i]);
      if (bunch.length >= 50 || i === allTokens.length - 1) {
        await makeRequest({
          type: METAMASK_EVENTS.call,
          address: userAddress,
          method: CONTRACT_METHODS.getEarningData,
          params: [bunch],
          contract: gameManager,
          onSuccess: (earningData) => {
            if (earningData) {
              const { '0': earned, '1': speed } = earningData;
              earnedAmount = earnedAmount + parseInt(earned) * 1e-18;
              earnSpeed = earnSpeed + parseInt(speed);
            }
          }
        });
        bunch = [];
      }
    }
    dispatch(setEarnedAmount(earnedAmount));
    dispatch(setEarnSpeed(earnSpeed));
  }, [plotTokens, dispatch, gameManager]);

  const fetchUserBalance = React.useCallback(
    async (address, web3Instance) => {
      await updateCLNYBalance(address);
      await updateEarnedAll();
      let _balance: number;
      try {
        _balance = +fromWei(
          await web3Instance.eth.getBalance(address),
          'ether'
        );
      } catch {
        _balance = 0;
      }

      if (userBalance !== _balance) {
        logDevInfo(`Balance set success ${_balance}`);
        dispatch(setUserBalance(_balance));
        dispatch(setInitialized(true));
      }
    },
    [userBalance]
  );

  const airdrop = React.useCallback((beneficiar: string, landId: number) => {
    return makeSendRequest({
      contract: gameManager ?? getGameManager(),
      method: 'airdrop',
      params: [beneficiar, landId],
      address,
      eventName: 'Airdropping land'
    });
  }, []);

  const dropAvatars = React.useCallback(
    (beneficiar: string, amount: number) => {
      return makeSendRequest({
        contract: getAvatarsManager(),
        method: 'dropAvatars',
        params: [beneficiar, amount],
        address,
        eventName: 'Airdropping avatars'
      });
    },
    []
  );

  const claimToken = React.useCallback(
    async (tokenNumbers: number[], address: string, web3Instance: Web3) => {
      trackGoogleAnalyticsEvent('cart.start', { tokens: tokenNumbers });
      for (const tokenNumber of tokenNumbers) {
        if (Number.isNaN(tokenNumber)) return;
        const tokenId: string = tokenNumber.toString();
        if (tokenId === null) return;
      }

      let txHash: string | null = null;

      const feeValue = await makeRequest({
        method: CONTRACT_METHODS.getFee,
        params: [
          tokenNumbers.length,
          localStorage.getItem('referralAddress') ?? EMPTY_ADDRESS
        ],
        address,
        type: METAMASK_EVENTS.call,
        contract: gameManager ?? getGameManager()
      });

      makeRequest({
        type: METAMASK_EVENTS.send,
        method: CONTRACT_METHODS.claim,
        contract: gameManager ?? getGameManager(),
        params: [
          tokenNumbers,
          localStorage.getItem('referralAddress') ?? EMPTY_ADDRESS
        ],
        onLoad: (hash: string) => {
          trackGoogleAnalyticsEvent('cart.pending', {
            tokens: tokenNumbers,
            hash
          });

          txHash = hash;

          window.view?.popup?.close?.();
          window.ogPopup?.setVisibility?.(false);
          fetchUserBalance(address, web3Instance);

          dispatch(setClaimingCartStatus(true));
          setFBPixel();
        },
        onSuccess: () => {
          fetchUserBalance(address, web3Instance);

          if (tokens !== null)
            dispatch(setUserTokens([tokenNumbers.toString()]));
          if (allMintedTokens !== null)
            dispatch(setMintedTokens(tokenNumbers.toString()));

          trackGoogleAnalyticsEvent('cart.success', {
            tokens: tokenNumbers,
            hash: txHash
          });

          for (const cartItem of isCartOpened) {
            freeReserve(+cartItem).catch(() => {});
          }

          dispatch(resetCart());
          dispatch(setClaimingCartStatus(false));
        },
        onError: () => {
          trackGoogleAnalyticsEvent('cart.error', {
            tokens: tokenNumbers,
            hash: txHash
          });

          dispatch(setClaimingCartStatus(false));
        },
        transactionOptions: {
          value: feeValue,
          type: CURRENT_CHAIN.x2
        },
        address,
        eventName: METHODS_LABELS.landClaim
      });
    },
    [gameManager, tokens, allMintedTokens, dispatch, isCartOpened]
  );

  const transfer = React.useCallback(
    async (address, tokenNumber = -1, addressTo: string) => {
      trackGoogleAnalyticsEvent('transfer.start', {
        token: tokenNumber,
        addressTo
      });

      const tokenId: string = tokenNumber.toString();
      let txHash: string | null = null;

      makeRequest({
        address,
        type: METAMASK_EVENTS.send,
        method: CONTRACT_METHODS.safeTransferFrom,
        contract: mcManager ?? getMCManager(),
        params: [address, addressTo, tokenId],
        transactionOptions: { type: CURRENT_CHAIN.x2 },
        eventName: METHODS_LABELS.landTransfer(tokenId),
        onLoad: (hash: string) => {
          txHash = hash;
          trackGoogleAnalyticsEvent('transfer.pending', {
            token: tokenNumber,
            addressTo,
            hash
          });
        },
        onSuccess: () => {
          if (tokens !== null) {
            dispatch(setUserTokens(tokens.filter((item) => item !== tokenId)));
          }

          trackGoogleAnalyticsEvent('transfer.success', {
            token: tokenNumber,
            addressTo,
            hash: txHash
          });
        },
        onError: () => {
          trackGoogleAnalyticsEvent('transfer.error', {
            token: tokenNumber,
            addressTo,
            hash: txHash
          });
        }
      });
    },
    [tokens, dispatch, mcManager]
  );

  const collectAllStats = React.useCallback(
    async (address, web3Instance) => {
      trackUserEvent('Collect all clicked', { address });
      trackGoogleAnalyticsEvent('collect_all.start');
      const partialCollect = async (
        bunch: any[],
        part: number,
        partsCount: number
      ): Promise<void> => {
        return new Promise((rs) => {
          makeRequest({
            address,
            contract: gameManager ?? getGameManager(),
            method: CONTRACT_METHODS.claimEarned,
            params: [bunch],
            transactionOptions: { type: CURRENT_CHAIN.x2 },
            onLoad: (hash) => {
              rs();
              trackGoogleAnalyticsEvent('collect_all.pending', { hash });
            },
            onSuccess: () => {
              rs();
              trackUserEvent('Collect all succeed', {
                address
              });

              if (part === partsCount) {
                fetchUserBalance(address, web3Instance);
                dispatch(setIsCollecting(false));
              }
            },
            onError: () => {
              rs();
              trackUserEvent('Collect all failed', {
                address
              });
              trackGoogleAnalyticsEvent('collect_all.error');

              if (part === partsCount) {
                fetchUserBalance(address, web3Instance);
                dispatch(setIsCollecting(false));
              }
            },
            type: METAMASK_EVENTS.send,
            eventName: METHODS_LABELS.partialClaim(part, partsCount)
          });
        });
      };

      try {
        dispatch(setIsCollecting(true));
        const allTokens = Array.from(tokens ?? []);
        const bunchCount = Math.ceil(allTokens.length / BUNCH_SIZE);
        let bunch = [];
        let bunchNumber = 1;
        for (let k = 0; k < allTokens.length; k++) {
          bunch.push(allTokens[k]);
          if (bunch.length >= BUNCH_SIZE) {
            await partialCollect([...bunch], bunchNumber++, bunchCount);
            bunch = [];
          }
        }
        if (bunch.length > 0) {
          await partialCollect([...bunch], bunchNumber++, bunchCount);
        }

        await fetchUserBalance(address, web3Instance);
      } catch (error) {
        trackGoogleAnalyticsEvent('collect_all.error');

        addToast(`${NETWORK_DATA.TOKEN_NAME} collecting error!`, {
          appearance: TOASTS_APPEARANCE.error
        });
      }
    },
    [dispatch, fetchUserBalance, gameManager, setGameManager, tokens]
  );

  const getAccountAssets = React.useCallback(
    async (addressRef, web3Instance) => {
      if (!web3Instance) return;
      try {
        const accounts = await web3Instance!.eth.getAccounts();
        const _address = accounts[0];

        if (_address !== address) {
          logDevInfo(`Set address in get account assets: ${_address}`);
          addressRef.current = _address;
          dispatch(setAddress(_address));
          window.address = _address;
        }

        await fetchUserBalance(addressRef.current, web3Instance);

        let _contract;

        if (!_contract) {
          _contract = getMCManager();
          _contract.events.Transfer({ fromBlock: 'latest' }, function () {});
        }

        const isStatsEmpty =
          tokens === null && allMintedTokens === null && !isLoadingTokens;
        if (isStatsEmpty) {
          makeRequest({
            method: CONTRACT_METHODS.allMyTokens,
            address: addressRef.current,
            errorText: 'Error getting owned tokens list',
            type: METAMASK_EVENTS.call,
            contract: _contract,
            onSuccess: async (_tokens) => {
              const allData = await Ethereum.getTokens();
              dispatch(setUserTokens(_tokens));
              dispatch(resetMintedTokens(allData));
              dispatch(setInitialized(true));
              dispatch(setIsLoading({ field: 'tokensLoading', value: false }));

              if (isAvatarsAvailable) {
                const userAvatars = await getUserAvatars();
                const avatarsNames = await getAvatarsNames(userAvatars);
                const xp = await getAvatarsXP(userAvatars);

                dispatch(setUserAvatarsList(userAvatars));
                dispatch(setAvatarsNamesList(avatarsNames));
                dispatch(setAvatarsXPList(calculateAvatarsXP(userAvatars, xp)));

                if (!isSelectedAvatar) {
                  const lastMinted = userAvatars[userAvatars?.length - 1] ?? '';
                  dispatch(setSelectedAvatar(lastMinted));
                  localStorage.setItem(
                    LOCAL_STORAGE_KEYS.selectedAvatar,
                    lastMinted
                  );
                }

                if (isMissionsAvailable) {
                  const missions = await QuestsBackend.getLimits({
                    landIds: _tokens,
                    avatarIds: userAvatars
                  });

                  dispatch(setLandsMissionsLimits(missions?.lands));
                  dispatch(setAvatarsMissionsLimits(missions?.avatars));
                }
                dispatch(setRepaintMode(true));
              }
            }
          });
        }
      } catch (err) {
        logDevInfo(`Error while getting account assets: ${err}`);
      }
    },
    [
      dispatch,
      lootboxesManager,
      isMissionsAvailable,
      isSelectedAvatar,
      tokens,
      allMintedTokens,
      isLoadingTokens
    ]
  );

  React.useEffect(() => {
    if (speed === 0) return;
    if (softTimer.current) {
      clearInterval(softTimer.current);
    }

    if (
      NETWORK_DATA.ECONOMY === 'fixed' &&
      process.env.REACT_APP_BALANCE_CHECK_AVAILABLE
    ) {
      softTimer.current = setInterval(() => {
        dispatch(setEarnedAmount(earnedAmount + 0.01));
      }, EARNED_AMOUNT_CHECK_TICK / speed);

      return () => {
        if (softTimer.current) {
          clearInterval(softTimer.current);
        }
      };
    }
  }, [speed, dispatch, earnedAmount]);

  window.updateCLNY = updateCLNYBalance;
  window.updateEarnedAll = updateEarnedAll;
  window.fetchBalance = fetchUserBalance;
  window.claim = async (tokens: number[]) => {
    if (window.xweb3 && address)
      await claimToken(tokens, address, window.xweb3);
  };
  window.transfer = transfer;
  window.collectAllStats = collectAllStats;
  window.getAccountsAssets = getAccountAssets;
  window.dropLand = (beneficiar: string, id: number) => airdrop(beneficiar, id);
  window.dropAvatars = (beneficiar: string, amount: number) =>
    dropAvatars(beneficiar, amount);

  return {
    updateCLNYBalance,
    updateEarnedAll,
    fetchUserBalance,
    claimToken,
    transfer,
    collectAllStats,
    getAccountAssets,
    tokens,
    allMintedTokens,
    userBalance,
    earnedAmount,
    dailySpeed: speed,
    isCollectInProgress,
    clnyBalance,
    isLoadingTokens
  };
};
