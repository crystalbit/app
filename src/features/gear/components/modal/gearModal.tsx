import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useGears } from '@features/gear/hooks/useGears';
import { getGearMeta } from '@features/gear/utils';
import useLootboxes from '@features/lootboxes/hooks/useLootboxes';
import { COLLECTION_ITEMS_TYPES } from '@features/lootboxes/types';
import { LootboxPriceTextBlock } from '@features/play/component/storage/lootbox/lootboxItem.styles';
import Button from '@global/components/button';
import CommonModal from '@global/components/commonModal';
import useAppParts from '@global/hooks/useAppParts';
import useFlags from '@global/hooks/useFlags';
import { WHITE } from '@global/styles/variables';
import { NETWORK_DATA } from '@root/settings';
import { toggleGearPopup } from '@slices/appPartsSlice';
import { selectCollectionItemToDisplay } from '@slices/lootboxesSlice';
import BN from 'bn.js';

import {
  GearModalContent,
  GearModalText,
  GearModalTitle,
  ItemFrame,
  ItemStat,
  ModalButtonWrapper,
  ModalPriceTextWrapper,
  StatColumWrapper,
  StatsHeader,
  StatsText
} from './modal.styles';

export const GearModal = () => {
  const dispatch = useDispatch();
  const { isGearModalOpened } = useAppParts();
  const { selectedCollectionItem, dropSelectedCollectionItem, clnyPrice } =
    useLootboxes();
  const { openLootbox, isMintingLoad, getLastMintedGear } = useGears();
  const { type, id, rarity } = selectedCollectionItem;
  const { isLootboxesMintingAvailable } = useFlags();

  const [lastMintedGear, setLastMintedGear] = useState<string | null>(null);
  const [gearMeta, setGearMeta] = useState<Record<string, any>>({});

  const clnyPriceValue = useMemo(() => {
    if (!isLootboxesMintingAvailable) return;
    if (!clnyPrice) return 'Loading...';
    return (
      clnyPrice.rate *
      1e-18 *
      NETWORK_DATA.LOOTBOX_OPEN_PRICE[rarity ?? ''] *
      1.05
    ).toFixed(0);
  }, [clnyPrice, rarity]);

  useEffect(() => {
    if (isGearModalOpened && !id) {
      getLastMintedGear((data) => setLastMintedGear(data)).then(() => {});
    }
  }, [isGearModalOpened, id, lastMintedGear]);

  useEffect(() => {
    if (lastMintedGear) {
      getGearMeta(lastMintedGear).then((data) => setGearMeta(data));
    }

    if (id && type === COLLECTION_ITEMS_TYPES.gear) {
      getGearMeta(`${NETWORK_DATA.GEAR_META_LINK}/${id}`).then((data) =>
        setGearMeta(data)
      );
    }
  }, [lastMintedGear, id, type]);

  const closePopup = () => {
    if (isMintingLoad.length) return;
    dispatch(toggleGearPopup(false));
    dispatch(selectCollectionItemToDisplay({ type: '', id: '', rarity: '' }));
    setLastMintedGear(null);
    setGearMeta({});
  };

  const onLinkOpen = () =>
    window.open(
      'https://people.marscolony.io/t/utility-crates-unlocking-and-mining-mission-gear/4961',
      '_blank'
    );

  const modalContent = useMemo(() => {
    if (type === COLLECTION_ITEMS_TYPES.gear || !id.length) {
      return (
        <>
          <GearModalTitle>{gearMeta.title}</GearModalTitle>
          <GearModalText>{gearMeta.description}</GearModalText>
          <ItemFrame
            url={
              lastMintedGear
                ? `${lastMintedGear}.jpg?thumb=1`
                : `${NETWORK_DATA.GEAR_META_LINK}/${id}.jpg?thumb=1`
            }
          />
          <ItemStat>
            <StatsHeader align="baseline">
              <StatColumWrapper>
                <StatsText>Type</StatsText>
                <StatsText fs="12px">{gearMeta.type}</StatsText>
              </StatColumWrapper>
              <StatColumWrapper>
                <StatsText>Rarity</StatsText>
                <StatsText fs="12px">{gearMeta.rarity}</StatsText>
              </StatColumWrapper>
              <StatColumWrapper>
                <StatsText>Buff</StatsText>
                <StatsText fs="12px">{gearMeta.buff}</StatsText>
              </StatColumWrapper>
              <StatColumWrapper>
                <StatsText>Durability</StatsText>
                <StatsText fs="12px">{gearMeta.durability}</StatsText>
              </StatColumWrapper>
            </StatsHeader>
          </ItemStat>
          <Button
            text="About mining mission GEAR"
            onClick={onLinkOpen}
            variant="ghost"
          />
        </>
      );
    } else {
      return (
        <>
          <GearModalTitle>Locked utility crate</GearModalTitle>
          <GearModalText limit="470px">
            Unlock the crate to get gear that will help you to pass the mining
            mission
          </GearModalText>
          <ItemFrame
            url={`${NETWORK_DATA.LOOTBOXES_META_LINK}/${id}/${rarity}.png`}
          />
          <ModalButtonWrapper>
            {clnyPrice && (
              <ModalPriceTextWrapper>
                <Button
                  text={`UNLOCK for ${
                    NETWORK_DATA.LOOTBOX_OPEN_PRICE[rarity ?? '']
                  }$`}
                  onClick={() => {
                    openLootbox(
                      id,
                      new BN(
                        Math.floor(
                          clnyPrice.rate *
                            1e-10 *
                            1.05 *
                            NETWORK_DATA.LOOTBOX_OPEN_PRICE[rarity ?? '']
                        )
                      ).mul(new BN(1e10)),
                      dropSelectedCollectionItem
                    );
                  }}
                  variant="common"
                  disabled={Boolean(isMintingLoad.length)}
                  disabledText="Opening..."
                />
                {isLootboxesMintingAvailable && (
                  <LootboxPriceTextBlock isModalVersion>
                    <p>
                      Up to <span>{clnyPriceValue}</span>{' '}
                      {NETWORK_DATA.TOKEN_NAME} will be burned
                    </p>
                  </LootboxPriceTextBlock>
                )}
              </ModalPriceTextWrapper>
            )}
          </ModalButtonWrapper>
        </>
      );
    }
  }, [
    type,
    id,
    rarity,
    isMintingLoad,
    lastMintedGear,
    gearMeta,
    clnyPrice,
    clnyPriceValue
  ]);

  if (!isGearModalOpened) return null;

  return (
    <CommonModal
      mobileBreakpoint={850}
      onClose={closePopup}
      width="824px"
      border={`1px solid ${WHITE}`}
    >
      <GearModalContent>{modalContent}</GearModalContent>
    </CommonModal>
  );
};
