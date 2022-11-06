import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ButtonWrapper } from '@features/global/components/button/button.styles';
import { NoAddressChangeWrapper } from '@features/global/styles/app.styles';
import {
  DexGrid,
  LandPlotEarnedButton,
  XchangeWrapper
} from '@features/lands/styles/landPlot.styles';
import { Farming } from '@features/xchange/components/Farming';
import { useBalance } from '@global/hooks/useBalance';
import useMediaQuery from '@global/hooks/useMediaQuery';
import usePersonalInfo from '@global/hooks/usePersonalInfo';
import useSearchQuery from '@global/hooks/useSearchQuery';
import { trackUserEvent } from '@global/utils/analytics';
import FarmingButton from '@images/photo/xchange/UIParts/farmButton.png';
import PoolButton from '@images/photo/xchange/UIParts/poolButton.png';
import SwapButton from '@images/photo/xchange/UIParts/swapButton.png';
import {
  DexBackground,
  DexButtons,
  DexButtonsSeparator,
  DexCol,
  DexRow,
  DexRowButtons,
  XChangePageWrapper
} from '@root/legacy/xChange.styles';
import { CURRENT_CHAIN } from '@root/settings/chains';
import { userGameManagerSelector } from '@selectors/commonAppSelectors';
import mixpanel from 'mixpanel-browser';
import useResizeObserver from 'use-resize-observer';

export enum TABS {
  swap = 'swap',
  pool = 'pool',
  mining = 'mining'
}

const XChange = () => {
  useEffect(() => {
    mixpanel.track('Page visited', { pageName: 'XChange Page' });
  }, []);
  const [currentTab, setCurrentTab] = useState<TABS | null>(null);
  const { ref: wrapperRef } = useResizeObserver();
  const navigate = useNavigate();
  const gm = useSelector(userGameManagerSelector);
  const { address } = usePersonalInfo();
  const { updateCLNYBalance } = useBalance();
  const isDeviceToRedirect = useMediaQuery(
    'screen and (max-width: 760px), screen and (max-height: 760px)'
  );
  const query = useSearchQuery();

  useEffect(() => {
    const type = query.get('type') ?? 'swap';
    if (currentTab && isDeviceToRedirect && type !== TABS.mining) {
      window.location.href = 'https://dex.marscolony.io/#/swap';
      return;
    }

    setCurrentTab(TABS[type as TABS]);
  }, [query, isDeviceToRedirect, currentTab]);

  if (!address || window.xweb3 === null || !gm)
    return (
      <NoAddressChangeWrapper>
        <p>Please connect your wallet first.</p>
        <ButtonWrapper variant="common" onClick={() => navigate('/')}>
          BACK
        </ButtonWrapper>
      </NoAddressChangeWrapper>
    );

  if (isDeviceToRedirect)
    return (
      <XChangePageWrapper ref={wrapperRef}>
        <Farming
          web3={window.xweb3}
          address={address}
          chainData={CURRENT_CHAIN}
          onCLNYBalanceUpdate={updateCLNYBalance}
          isXChangePage
          isMobileView
          setTab={setCurrentTab}
          selectedTab={currentTab}
        />
      </XChangePageWrapper>
    );

  return (
    <XchangeWrapper ref={wrapperRef} Width={'100%'} OverFlow={'hidden'}>
      <LandPlotEarnedButton
        onClick={() => navigate('/')}
        Width={'fit-content'}
        Position={'fixed'}
        Left={'10px'}
        Top={'10px'}
        zIndex={'2'}
      >
        GO BACK
      </LandPlotEarnedButton>
      <DexBackground />
      <DexGrid className="grid" Position={'relative'}>
        <DexRow>
          <DexCol>
            {currentTab === TABS.mining ? (
              <Farming
                web3={window.xweb3}
                address={address}
                chainData={CURRENT_CHAIN}
                onCLNYBalanceUpdate={updateCLNYBalance}
                setTab={setCurrentTab}
                selectedTab={currentTab}
              />
            ) : (
              <iframe
                src={`https://dex.marscolony.io/#/${currentTab}`}
                title="DEX UI"
              />
            )}
          </DexCol>
        </DexRow>
        <DexRowButtons>
          <DexButtons>
            <div
              className="button"
              onClick={() => {
                trackUserEvent('Swap clicked', { address });
                navigate('/xchange?type=swap');
              }}
            >
              <img src={SwapButton} alt="Swap button" />
            </div>
            <DexButtonsSeparator />
            <div
              className="button"
              onClick={() => {
                trackUserEvent('Pool clicked', { address });
                navigate('/xchange?type=pool');
              }}
            >
              <img src={PoolButton} alt="Pool button" />
            </div>
            <DexButtonsSeparator />
            <div
              className="button"
              onClick={() => {
                trackUserEvent('Farming clicked', { address });
                navigate('/xchange?type=mining');
              }}
            >
              <img src={FarmingButton} alt="Farm button" />
            </div>
          </DexButtons>
        </DexRowButtons>
      </DexGrid>
    </XchangeWrapper>
  );
};

export default XChange;
