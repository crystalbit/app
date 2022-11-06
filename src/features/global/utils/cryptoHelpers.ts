import WalletConnectProvider from '@walletconnect/web3-provider';
import { toBech32 as _toBech32 } from '@harmony-js/crypto';

export const providerOptions = {
  injected: {
    display: {
      name: 'Metamask',
      description: 'Connect with the provider in your Browser'
    },
    package: null,
    options: {}
  },
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: process.env.REACT_APP_INFURA_ID
    }
  }
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
