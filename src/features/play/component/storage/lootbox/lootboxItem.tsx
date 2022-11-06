import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useGears } from '@features/gear/hooks/useGears';
import {
  COLLECTION_ITEMS_TYPES,
  CollectionItemsType
} from '@features/lootboxes/types';
import useFlags from '@global/hooks/useFlags';
import { trackUserEvent } from '@global/utils/analytics';
import { CommonButton } from '@root/legacy/buttons/commonButton';
import { NETWORK_DATA } from '@root/settings';
import { toggleGearPopup } from '@slices/appPartsSlice';
import { selectCollectionItemToDisplay } from '@slices/lootboxesSlice';
import BN from 'bn.js';

import {
  LootboxCardButtonWrapper,
  LootboxCardSignWrapper,
  LootboxCardWrapper,
  LootboxPriceTextBlock
} from './lootboxItem.styles';

export const LootboxItem = ({
  src,
  rarity,
  isPending,
  type = COLLECTION_ITEMS_TYPES.lootbox,
  activeItems,
  clnyPrice = 1
}: {
  src: string | number;
  rarity: string;
  isPending?: boolean;
  type?: CollectionItemsType;
  activeItems?: string[];
  clnyPrice?: number;
}) => {
  const dispatch = useDispatch();
  const { openLootbox } = useGears();

  const isGearItem = type === COLLECTION_ITEMS_TYPES.gear;
  const { isLootboxesMintingAvailable } = useFlags();

  const pendingText = useMemo(() => {
    if (!isLootboxesMintingAvailable) return 'UNLOCK (COMING SOON)';
    if (activeItems?.length && !isPending) return 'Loading...';
    return 'Minting...';
  }, [isLootboxesMintingAvailable, isPending, activeItems]);

  const buttonText = useMemo(() => {
    if (!isLootboxesMintingAvailable) return 'UNLOCK (COMING SOON)';
    return `UNLOCK for ${NETWORK_DATA.LOOTBOX_OPEN_PRICE[rarity]}$`;
  }, [isLootboxesMintingAvailable, isPending]);

  const imageSrc = useMemo(() => {
    if (isGearItem) return `${NETWORK_DATA.GEAR_META_LINK}/${src}.jpg`;
    return `${NETWORK_DATA.LOOTBOXES_META_LINK}/${src}/${rarity}.png`;
  }, [isGearItem, rarity, src]);

  const calculatedPrice = useMemo(
    () =>
      (
        clnyPrice *
        1e-18 *
        NETWORK_DATA.LOOTBOX_OPEN_PRICE[rarity] *
        1.05
      ).toFixed(0),
    [clnyPrice, rarity]
  );

  const clnyPriceValue = useMemo(() => {
    if (!isLootboxesMintingAvailable) return;
    if (!clnyPrice) return 'Loading...';
    return calculatedPrice;
  }, [calculatedPrice, clnyPrice, isLootboxesMintingAvailable]);

  const onCollectionItemSelect = () => {
    trackUserEvent('Information clicked', { type, rarity, id: src });
    dispatch(selectCollectionItemToDisplay({ type, id: src, rarity }));
    dispatch(toggleGearPopup(true));
  };

  const isButtonPending =
    isPending || !isLootboxesMintingAvailable || Boolean(activeItems?.length);

  return (
    <LootboxCardWrapper backgroundImg={imageSrc} gear={isGearItem}>
      <LootboxCardSignWrapper onClick={onCollectionItemSelect}>
        i
      </LootboxCardSignWrapper>
      {!isGearItem && (
        <>
          <LootboxCardButtonWrapper>
            <CommonButton
              additionalClass="common-button-modification"
              text={buttonText}
              onClick={async () => {
                trackUserEvent('Unlock crate clicked');
                await openLootbox(
                  src.toString(),
                  new BN(
                    Math.floor(
                      clnyPrice *
                        1e-10 *
                        1.05 *
                        NETWORK_DATA.LOOTBOX_OPEN_PRICE[rarity]
                    )
                  ).mul(new BN(1e10))
                );
              }}
              isPending={isButtonPending}
              pendingText={pendingText}
            />
          </LootboxCardButtonWrapper>
          {isLootboxesMintingAvailable && (
            <LootboxPriceTextBlock>
              <p>
                Up to <span>{clnyPriceValue}</span> {NETWORK_DATA.TOKEN_NAME}{' '}
                will be burned
              </p>
            </LootboxPriceTextBlock>
          )}
        </>
      )}
    </LootboxCardWrapper>
  );
};
