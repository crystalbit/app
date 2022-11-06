import React from 'react';
import {
  NewDexTitle,
  NewDexWrapper,
  NewPoolListWrapper
} from '@features/lands/styles/landPlot.styles';
import { OnePool } from '@features/xchange/components/OnePool';
import { TABS } from '@pages/XChange';
import { NETWORK_DATA } from '@root/settings';
import { ChainData } from '@root/settings/chains';
import Web3 from 'web3';

type Props = {
  web3: Web3 | null;
  address: string;
  chainData: ChainData;
  onCLNYBalanceUpdate: (address: string) => Promise<void>;
  isXChangePage?: boolean;
  isMobileView?: boolean;
  selectedTab?: string | null;
  setTab?: (val: TABS) => void;
};

export const Farming: React.FC<Props> = ({
  address,
  chainData,
  onCLNYBalanceUpdate,
  isXChangePage = false,
  isMobileView,
  selectedTab,
  setTab
}) => {
  if (!NETWORK_DATA.LIQUIDITY_MINING) return null;

  return (
    <NewDexWrapper isMobileView={isMobileView}>
      <NewDexTitle>Your liquidity</NewDexTitle>
      <NewPoolListWrapper>
        {NETWORK_DATA.MINING_POOLS.map((poolData, index) => (
          <OnePool
            isXChangePage={isXChangePage}
            address={address}
            miningIndex={index}
            chainData={chainData}
            onCLNYBalanceUpdate={onCLNYBalanceUpdate}
            bottomBorder={index !== NETWORK_DATA.MINING_POOLS.length - 1}
            isMobileView={isMobileView}
            selectedTab={selectedTab}
            setTab={setTab}
          />
        ))}
      </NewPoolListWrapper>
    </NewDexWrapper>
  );
};
