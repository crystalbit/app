import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import useMediaQuery from '@features/global/hooks/useMediaQuery';
import {
  copyTextToClipboard,
  formatWallet
} from '@features/globus/utils/methods';
import Button from '@global/components/button';
import {
  BlockButton,
  MainAppContainer,
  MarsNavConnectedModal,
  MarsNavConnectedModalLink,
  MarsNavConnectedModalTitle,
  MarsNavConnectedWallet,
  MarsNavPanelItemFlexed,
  MobileTableBlock,
  MobileTableBlockBalance,
  MobileTableText,
  MobileTableWalletBlock,
  MobileTableWrapperWallet,
  NewHeaderAddressText,
  NewHeaderInfoWrapper,
  NewHeaderStatInnerWrapper,
  NewHeaderStatWrapper
} from '@global/styles/app.styles';
import MarsIconImg from '@images/photo/connection-zone-icons/MarsIcon.png';
import OneIconImg from '@images/photo/connection-zone-icons/OneIcon.png';
import PolygonIconImg from '@images/photo/connection-zone-icons/PolygonIcon.png';
import { Copy } from '@root/images/icons/Copy';
import { ImageIconWrapper } from '@root/images/icons/imageIconWrapper';
import { WalletIcon } from '@root/images/icons/WalletIcon';
import { NETWORK_DATA } from '@root/settings';
import { CURRENT_CHAIN } from '@root/settings/chains';
import { isConnectionPopupSelector } from '@selectors/appPartsSelectors';
import {
  isInitializedSelector,
  providerSelector
} from '@selectors/commonAppSelectors';
import {
  clnyBalanceSelector,
  userBalanceSelector
} from '@selectors/userStatsSelectors';
import { toggleConnectionPopup } from '@slices/appPartsSlice';
import mixpanel from 'mixpanel-browser';

export const ConnectionZone = ({
  address,
  onConnect
}: {
  address: string;
  onConnect: () => void;
}) => {
  const dispatch = useDispatch();
  const popupRef = useRef<HTMLDivElement>(null);
  const { addToast } = useToasts();
  const balance = useSelector(userBalanceSelector);
  const clnyBalance = useSelector(clnyBalanceSelector);
  const showConnectionPopup = useSelector(isConnectionPopupSelector);
  const provider = useSelector(providerSelector);
  const isInitialized = useSelector(isInitializedSelector);
  const isTableMobile = useMediaQuery(`(min-width: 630px)`);
  const [contentSpace, setContentSpace] = useState<string>('space-between');

  useEffect(() => {
    const handleMouseClick = (event: any) => {
      let flagConnection = false;
      for (let value of event.composedPath()) {
        if ('headerInfo' === value.id || 'connectionInfo' === value.id) {
          flagConnection = !flagConnection;
        }
      }
      if (!flagConnection) {
        dispatch(toggleConnectionPopup(false));
      }
    };

    document.addEventListener('click', handleMouseClick);

    return () => {
      document.removeEventListener('click', handleMouseClick);
    };
  }, [showConnectionPopup]);

  const normalizeBalance = useMemo(() => {
    if (balance === -1) {
      return '---';
    } else if (+balance.toFixed(2) > 1000) {
      return `${+balance.toFixed(2)}k`;
    } else {
      setContentSpace('space-around');
      return +balance.toFixed(2);
    }
  }, [balance]);

  const normalizeClnyBalance = useMemo(() => {
    if (clnyBalance === -1) {
      return '---';
    } else if (+clnyBalance.toFixed(2) > 1000) {
      if (+clnyBalance.toFixed(2) > 1000000) {
        return `${+clnyBalance.toFixed(2)}kk`;
      }
      return `${+clnyBalance.toFixed(2)}k`;
    } else {
      setContentSpace('space-around');
      return +clnyBalance.toFixed(2);
    }
  }, [clnyBalance]);

  if (!provider && !isInitialized) {
    return (
      <Button
        text="Connect wallet"
        variant="common"
        onClick={() => onConnect()}
      />
    );
  }

  if (Boolean(provider) && !isInitialized) {
    return <>Loading...</>;
  }

  return (
    <MainAppContainer>
      {isTableMobile ? (
        <NewHeaderInfoWrapper
          id={'headerInfo'}
          onClick={() => {
            mixpanel.track('Wallet details clicked', {
              address
            });
            dispatch(toggleConnectionPopup(!showConnectionPopup));
          }}
        >
          <NewHeaderStatWrapper>
            <ImageIconWrapper src={MarsIconImg} dimension="14px" />
            {clnyBalance === -1
              ? '---'
              : +clnyBalance.toFixed(2) + ' ' + NETWORK_DATA.TOKEN_NAME}
          </NewHeaderStatWrapper>
          <NewHeaderStatWrapper>
            <ImageIconWrapper
              src={
                CURRENT_CHAIN.ticker === 'MATIC' ? PolygonIconImg : OneIconImg
              }
              dimension="14px"
            />
            {balance === -1 ? '---' : +balance.toFixed(1)}{' '}
            {CURRENT_CHAIN.ticker}
          </NewHeaderStatWrapper>
          <NewHeaderStatWrapper>
            <NewHeaderStatInnerWrapper>
              <WalletIcon />
              <NewHeaderAddressText>
                {formatWallet(address)}
              </NewHeaderAddressText>
            </NewHeaderStatInnerWrapper>
          </NewHeaderStatWrapper>
        </NewHeaderInfoWrapper>
      ) : (
        <MobileTableWrapperWallet
          content={contentSpace}
          id={'headerInfo'}
          onClick={() => {
            mixpanel.track('Wallet details clicked', {
              address
            });
            dispatch(toggleConnectionPopup(!showConnectionPopup));
          }}
        >
          <MobileTableBlockBalance>
            <MobileTableBlock>
              <ImageIconWrapper src={MarsIconImg} dimension="14px" />
              <MobileTableText>{normalizeClnyBalance}</MobileTableText>
            </MobileTableBlock>
            <MobileTableBlock>
              <ImageIconWrapper
                src={
                  CURRENT_CHAIN.ticker === 'MATIC' ? PolygonIconImg : OneIconImg
                }
                dimension="14px"
              />
              <MobileTableText>{normalizeBalance}</MobileTableText>
            </MobileTableBlock>
          </MobileTableBlockBalance>
          <MobileTableWalletBlock>
            <WalletIcon />
          </MobileTableWalletBlock>
        </MobileTableWrapperWallet>
      )}

      {showConnectionPopup && (
        <MarsNavConnectedModal ref={popupRef} id={'connectionInfo'}>
          <div>
            <MarsNavConnectedModalTitle>Account</MarsNavConnectedModalTitle>
            <div>
              <MarsNavConnectedWallet>
                <a
                  href="/"
                  onClick={(event) => {
                    event.preventDefault();
                    copyTextToClipboard(address)
                      .then(() => {
                        addToast('Address has been copied to clipboard', {
                          appearance: 'success'
                        });
                      })
                      .catch((error) => {
                        console.error(error);
                        addToast('Copying to clipboard has failed', {
                          appearance: 'error'
                        });
                      });
                  }}
                >
                  {address} <Copy />
                </a>
              </MarsNavConnectedWallet>
            </div>
          </div>
          <BlockButton>
            <MarsNavConnectedModalLink href="/" onClick={disconnect}>
              Disconnect
            </MarsNavConnectedModalLink>
            <MarsNavPanelItemFlexed>
              <a
                href={`${CURRENT_CHAIN.explorer}/address/${address}`}
                target="_blank"
                rel="noreferrer"
              >
                Explorer
              </a>
            </MarsNavPanelItemFlexed>
          </BlockButton>
        </MarsNavConnectedModal>
      )}
    </MainAppContainer>
  );
};
