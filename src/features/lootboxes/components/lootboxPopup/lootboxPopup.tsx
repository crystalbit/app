import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AvatarsSelectBackButton } from '@features/avatars/components/avatarsSelect/avatarsSelect.styles';
import { useGears } from '@features/gear/hooks/useGears';
import useLootboxes from '@features/lootboxes/hooks/useLootboxes';
import {
  extractLootboxIdFromURI,
  extractLootboxRarityFromURI
} from '@features/lootboxes/utils';
import { LootboxPriceTextBlock } from '@features/play/component/storage/lootbox/lootboxItem.styles';
import { Loader } from '@global/components/loader/loader';
import useFlags from '@global/hooks/useFlags';
import useOutsideClick from '@global/hooks/useOutsideClick';
import { CloseIcon } from '@images/icons/CloseIcon';
import { CommonButton } from '@root/legacy/buttons/commonButton';
import { NETWORK_DATA } from '@root/settings';
import { lastMintedLootboxSelector } from '@selectors/lootboxesSliceSelectors';
import {
  setLastOwnedLootbox,
  toggleLootboxPopup
} from '@slices/lootboxesSlice';
import BN from 'bn.js';

import {
  LoadingWrapper,
  LootboxPopupBackground,
  LootboxPopupButton,
  LootboxPopupContent,
  LootboxPopupCrate,
  LootboxPopupShadowBackground,
  LootboxPopupSubtitle,
  LootboxPopupTitle,
  LootboxPopupWrapper
} from './lootboxPopup.styles';

export const LootboxPopup = () => {
  const { isLootboxesMintingAvailable } = useFlags();
  const { openLootbox, isMintingLoad } = useGears();
  const { clnyPrice } = useLootboxes();

  const lastMintedLootbox = useSelector(lastMintedLootboxSelector) ?? '';
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setLoading] = useState(true);

  const overlayRef = useRef<HTMLDivElement>(null);
  useOutsideClick(overlayRef, () => {
    dispatch(toggleLootboxPopup(false));
    dispatch(setLastOwnedLootbox(null));
  });

  useEffect(() => {
    if (lastMintedLootbox?.length) setLoading(false);
  }, []);

  const onLootboxOpen = () => {
    if (!isLootboxesMintingAvailable || Boolean(isMintingLoad.length)) return;

    openLootbox(
      extractLootboxIdFromURI(lastMintedLootbox),
      new BN(
        (clnyPrice?.rate ?? 1) *
          1e-10 *
          1.05 *
          NETWORK_DATA.LOOTBOX_OPEN_PRICE[
            extractLootboxRarityFromURI(lastMintedLootbox) ?? ''
          ]
      ).mul(new BN(1e10)),
      () => {
        dispatch(toggleLootboxPopup(false));
        dispatch(setLastOwnedLootbox(null));
        navigate('/play/3');
      }
    ).then(() => {});
  };

  const clnyPriceValue = useMemo(() => {
    if (!isLootboxesMintingAvailable) return;
    if (!clnyPrice || !lastMintedLootbox) return 'Loading...';
    return (
      clnyPrice.rate *
      1e-18 *
      NETWORK_DATA.LOOTBOX_OPEN_PRICE[
        extractLootboxRarityFromURI(lastMintedLootbox) ?? ''
      ] *
      1.05
    ).toFixed(0);
  }, [clnyPrice, lastMintedLootbox, isLootboxesMintingAvailable]);

  return (
    <LootboxPopupWrapper ref={overlayRef}>
      <LootboxPopupBackground />
      <LootboxPopupShadowBackground />
      {isLoading && (
        <LoadingWrapper Position={'absolute'} Top={'220px'} Left={'296px'}>
          <Loader />
        </LoadingWrapper>
      )}
      <AvatarsSelectBackButton
        style={{ top: '25px', left: '20px', zIndex: 10 }}
        onClick={() => {
          dispatch(toggleLootboxPopup(false));
          dispatch(setLastOwnedLootbox(null));
        }}
      >
        <CloseIcon />
      </AvatarsSelectBackButton>
      <LootboxPopupContent>
        <LootboxPopupSubtitle>AI rewarded you with</LootboxPopupSubtitle>
        <LootboxPopupTitle>SEALED UTILITY CRATE</LootboxPopupTitle>
        <LootboxPopupCrate
          src={`${lastMintedLootbox?.slice(
            0,
            lastMintedLootbox?.length - 1
          )}.png`}
          alt="Crate image"
        />
        <LootboxPopupButton
          disabled={
            !isLootboxesMintingAvailable || Boolean(isMintingLoad.length)
          }
          onClick={onLootboxOpen}
        >
          {isLootboxesMintingAvailable
            ? `UNLOCK CRATE for ${
                NETWORK_DATA.LOOTBOX_OPEN_PRICE[
                  extractLootboxRarityFromURI(lastMintedLootbox) ?? ''
                ]
              }$`
            : 'Open storage'}
        </LootboxPopupButton>
        <LootboxPriceTextBlock isModalVersion>
          {isLootboxesMintingAvailable && (
            <p>
              Up to <span>{clnyPriceValue}</span> {NETWORK_DATA.TOKEN_NAME} will
              be burned
            </p>
          )}
        </LootboxPriceTextBlock>
        <CommonButton
          style={{
            fontWeight: 200,
            fontSize: '18px',
            lineHeight: '16px',
            fontFamily: 'Play'
          }}
          isGhost
          text="Open storage"
          onClick={() => {
            dispatch(toggleLootboxPopup(false));
            dispatch(setLastOwnedLootbox(null));
            navigate('/play/3');
          }}
        />
      </LootboxPopupContent>
    </LootboxPopupWrapper>
  );
};
