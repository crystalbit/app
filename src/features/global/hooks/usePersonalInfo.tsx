import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import { transformReferralAddress } from '@features/revshare/utils/referralProgram';
import { ADD_ETH_REQUEST_PAYLOAD } from '@global/constants';
import { useBalance } from '@global/hooks/useBalance';
import useContracts from '@global/hooks/useContracts';
import useFlags from '@global/hooks/useFlags';
import {
  CONNECT_EVENTS,
  ConnectEventsType,
  PROVIDER_EVENTS
} from '@global/types';
import {
  getDefaultEventPayload,
  logDevInfo,
  setUserIdentities,
  setUserIdentitiesFiled,
  trackGoogleAnalyticsEvent,
  trackUserEvent
} from '@global/utils/analytics';
import { providerOptions } from '@global/utils/cryptoHelpers';
import { extractURLParam } from '@global/utils/urlParams';
import { wrongChainToast } from '@global/utils/utilModals';
import {
  isConnecting,
  isInitializedSelector,
  providerSelector
} from '@redux/selectors/commonAppSelectors';
import {
  toggleConnectionPopup,
  toggleMyLandPopup
} from '@redux/slices/appPartsSlice';
import {
  resetInitializationOnDisconnect,
  setInitialized,
  setIsConnected,
  setIsLoading,
  setUserProvider
} from '@redux/slices/commonAppStateSlice';
import {
  resetUserBalance,
  resetUserTokens,
  setAddress
} from '@redux/slices/userStatsSlice';
import { NETWORK_DATA } from '@root/settings';
import { CURRENT_CHAIN, CURRENT_NET } from '@root/settings/chains';
import { addressSelector } from '@selectors/userStatsSelectors';
import { dropAvatarsInfo } from '@slices/avatarsSlice';
import { setChambersState } from '@slices/cryochambersSlice';
import Web3 from 'web3';
import Web3Modal from 'web3modal';

const web3Modal = new Web3Modal({
  cacheProvider: true,
  providerOptions,
  theme: 'dark'
});

const usePersonalInfo = (withInitialize = false) => {
  // REFS
  const web3 = React.useRef<Web3 | null>(null);
  const addressRef = React.useRef<string>('');

  // SELECTORS
  const connecting = useSelector(isConnecting);
  const isInitialized = useSelector(isInitializedSelector);
  const stateAddress = useSelector(addressSelector) ?? window.address;
  const provider = useSelector(providerSelector);

  // UTILS
  const dispatch = useDispatch();
  const location = useLocation();
  const { addToast, removeToast } = useToasts();

  // FEATURES
  const { initializeContracts } = useContracts();
  const { getAccountAssets } = useBalance();
  const { isAvatarsAvailable } = useFlags();

  const toastData = React.useMemo(() => ({ id: '' }), []);

  useEffect(() => {
    const referralAddress = extractURLParam(location, 'from');

    if (referralAddress?.length) {
      transformReferralAddress(referralAddress);
    }
  }, [location]);

  const disconnect = (window.disconnect = React.useCallback(
    async (event: React.MouseEvent<HTMLElement> | null = null) => {
      event?.preventDefault?.();
      web3Modal.clearCachedProvider();
      window.xweb3 = web3.current = null;
      addressRef.current = '';
      dispatch(resetUserBalance());
      dispatch(resetInitializationOnDisconnect());
      dispatch(toggleMyLandPopup(null));
      dispatch(toggleConnectionPopup(false));
      dispatch(setChambersState(null));

      if (isAvatarsAvailable) dispatch(dropAvatarsInfo());

      logDevInfo('DISCONNECT');
      trackGoogleAnalyticsEvent('disconnect');
    },
    []
  ));

  const connect = React.useCallback(
    async (to = '', type: ConnectEventsType = CONNECT_EVENTS.click) => {
      if (type === CONNECT_EVENTS.click) {
        trackUserEvent(
          'Connect wallet clicked',
          getDefaultEventPayload(addressRef.current)
        );
      }

      if (type === CONNECT_EVENTS.switch) {
        trackUserEvent(
          'Chain switching clicked',
          getDefaultEventPayload(addressRef.current)
        );
      }

      if (connecting) return;

      logDevInfo('CONNECT');

      let provider: any;

      try {
        if (to !== '') {
          provider = await web3Modal.connectTo(to);
        } else {
          provider = await web3Modal.connect();
        }

        trackUserEvent(
          'Wallet connected succeed',
          getDefaultEventPayload(addressRef.current)
        );
        trackGoogleAnalyticsEvent('userData', { userID: addressRef.current });

        dispatch(setIsConnected(true));
      } catch (error) {
        trackUserEvent('Wallet connect failed', {
          ...getDefaultEventPayload(addressRef.current),
          error
        });

        dispatch(setIsConnected(false));
      }

      dispatch(setUserProvider(provider));
      dispatch(setInitialized(false));
      dispatch(toggleMyLandPopup('lands'));

      await subscribeProvider(provider);

      window.xweb3 = web3.current = new Web3(provider);
      initializeContracts();

      setUserIdentities(addressRef.current);

      const referralAddress = extractURLParam(location, 'from');

      if (referralAddress?.length) {
        transformReferralAddress(referralAddress);
      }

      let chainId: number = 0;
      try {
        chainId = await web3.current.eth.getChainId();
      } catch (error: any) {
        addToast(error.message, { appearance: 'error' });
        return;
      }
      trackGoogleAnalyticsEvent('chain.connecting', { id: chainId });

      if (chainId !== CURRENT_NET) {
        showWrongChain();
        await disconnect();
        dispatch(setIsConnected(false));
        trackGoogleAnalyticsEvent('chain.wrong', {
          id: chainId,
          name: CURRENT_CHAIN?.name
        });
        return;
      }

      const accounts = await web3.current.eth.getAccounts();
      const addressValue = accounts[0];

      setUserIdentitiesFiled(addressRef.current);

      await updateAddress(addressValue);
      dispatch(setIsConnected(false));

      // https://ethereum.stackexchange.com/questions/75851/metamask-rpc-error-internal-json-rpc-error?rq=1
      await window.ethereum?.enable?.();
    },
    [connecting, addressRef.current]
  );

  const subscribeProvider = React.useCallback(
    async (provider: any) => {
      dispatch(setIsLoading({ field: 'tokensLoading', value: true }));
      if (!provider?.on) {
        return;
      }
      provider.on(PROVIDER_EVENTS.disconnect, () => {
        disconnect();
      });

      provider.on(
        PROVIDER_EVENTS.accountsChanged,
        async (accounts: string[]) => {
          dispatch(dropAvatarsInfo());
          const oldAddress = addressRef.current;
          await updateAddress(accounts[0]);
          await getAccountAssets(addressRef, web3.current);

          logDevInfo('EV: ACCOUNTS CHANGED');
          trackGoogleAnalyticsEvent('account.changed', {
            address: accounts[0],
            old: oldAddress
          });
        }
      );

      provider.on(PROVIDER_EVENTS.chainChanged, async (chainId: number) => {
        logDevInfo(['EV: CHAIN CHANGED', chainId.toString()], 'Chain switch:');
        trackGoogleAnalyticsEvent('chain.changed', { id: chainId });

        if (+chainId !== CURRENT_NET) {
          await disconnect();
          showWrongChain();

          window.dataLayer.push({
            event: 'chain.wrong',
            id: chainId,
            name: CURRENT_CHAIN?.name
          });
          return;
        }

        await getAccountAssets(addressRef, web3.current);
      });
    },
    [
      addToast,
      disconnect,
      getAccountAssets,
      addressRef.current,
      dispatch,
      CURRENT_NET,
      web3.current
    ]
  );

  const switchAddress = (address: string) => {
    addressRef.current = address;
    dispatch(setAddress(address));
    window.address = address;
  };

  const updateAddress = React.useCallback(
    async (_address: string) => {
      if (_address !== addressRef.current) {
        logDevInfo(`SET ADDRESS: ${_address}`);
        trackGoogleAnalyticsEvent('userData', {
          userID: _address
        });
        switchAddress(_address);
        dispatch(resetUserTokens());

        await getAccountAssets(addressRef, web3.current);
      }
    },
    [dispatch, addressRef.current]
  );

  const switchNetwork = React.useCallback(async (toastData: { id: string }) => {
    const ERROR_CHAIN_NOT_ADDED = 4902;
    const ERROR_CHAIN_NOT_ADDED_MOBILE = -32603;
    const chainId = '0x' + NETWORK_DATA.ID.toString(16);

    if (window.ethereum && toastData) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId }]
        });
        if (toastData.id !== '') {
          removeToast(toastData.id);
          toastData.id = '';
        }
        await connect('injected');
      } catch (error: any) {
        if (
          error?.code === ERROR_CHAIN_NOT_ADDED ||
          error?.data?.originalError?.code === ERROR_CHAIN_NOT_ADDED ||
          // SOURCE: https://github.com/MetaMask/metamask-mobile/issues/3629#issuecomment-1031304504
          error?.data?.originalError?.code === ERROR_CHAIN_NOT_ADDED_MOBILE
        ) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [ADD_ETH_REQUEST_PAYLOAD(chainId)]
            });
            if (toastData.id !== '') {
              removeToast(toastData.id);
              toastData.id = '';
            }
            await connect('injected');
          } catch (error: any) {
            addToast(error?.message ?? 'Switch error', { appearance: 'error' });
          }
        }
      }
    } else addToast('Metamask not found', { appearance: 'error' });
  }, []);

  const showWrongChain = React.useCallback(() => {
    if (toastData.id !== '') {
      return;
    }
    addToast(
      wrongChainToast(() => {
        trackUserEvent('Switch chain clicked');
        return switchNetwork(toastData);
      }),
      {
        appearance: 'info',
        autoDismiss: false,
        onDismiss: () => {
          toastData.id = '';
        }
      },
      (id: string) => {
        toastData.id = id;
      }
    );
  }, []);

  React.useEffect(() => {
    (async () => {
      if (web3Modal.cachedProvider && !isInitialized && withInitialize) {
        await connect();
      }
    })();
  }, [connect]);

  window.connect = connect;
  window.toast = addToast;
  window.logEvent = (name: string, payload: Record<string, any>) =>
    trackUserEvent(name, payload);

  return {
    address: stateAddress ?? addressRef.current,
    web3Instance: web3.current ?? window.xweb3,
    disconnect,
    connect,
    subscribeProvider,
    switchNetwork,
    updateAddress,
    showWrongChain,
    connecting,
    provider,
    isInitialized
  };
};

export default usePersonalInfo;
