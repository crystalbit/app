import WalletConnectProvider from '@walletconnect/web3-provider';
import { toBech32 as _toBech32 } from '@harmony-js/crypto';

export const getProviderOptions = (isZerion: boolean = false) => {
  console.log('getProviderOptions isZerion', isZerion);
  return {
    injected: {
      display: {
        ...(isZerion ? { logo: '/icons/zerion.png' } : {}),
        name: isZerion ? 'Zerion' : 'Metamask',
        description: isZerion
          ? 'Connect with Zerion in your Browser'
          : 'Connect with Metamask in your Browser'
      },
      package: null,
      options: {}
    },
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: process.env.REACT_APP_INFURA_ID
      }
    },
    ...(!isZerion
      ? {
          'custom-zerion': {
            display: {
              logo: '/icons/zerion.png',
              name: 'Install Zerion',
              description: 'Install Zerion wallet for Gasless transactions'
            },
            package: WalletConnectProvider,
            connector: async () => {
              window.open('https://zerion.io/download', '_blank');
              // Return a promise that never resolves since we're redirecting
              return new Promise(() => {});
            }
          }
        }
      : {})
  };
};

export const toBech32 = (address: string): string => {
  if (address === '') {
    return '';
  }
  try {
    return _toBech32(address);
  } catch {
    return 'error';
  }
};
