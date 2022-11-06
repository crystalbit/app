import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { COLLECTION_ITEMS_TYPES } from '@features/lootboxes/types';
import {
  ActiveGearCardWrapper,
  EmptyGearCardWrapper,
  GearCardLabel,
  GearCardOuterWrapper
} from '@features/play/component/mission/miningQuest/activeGearCard/activeGearCard.styles';
import { LootboxCardSignWrapper } from '@features/play/component/storage/lootbox/lootboxItem.styles';
import { Loader } from '@global/components/loader/loader';
import { LockerIcon } from '@images/icons/LockerIcon';
import { PlusIcon } from '@images/icons/PlusIcon';
import { toggleGearPopup } from '@slices/appPartsSlice';
import { selectCollectionItemToDisplay } from '@slices/lootboxesSlice';

type ActiveGearCardProps = {
  gearData: { src: string; rarity: string; id: string } | null;
  idx: number;
  isCommonTransport: boolean;
  onModeChange: (val: boolean) => unknown;
  isLoading: boolean;
  onConfirmStatusChange: (val: boolean) => void;
};

export const ActiveGearCard = ({
  gearData,
  idx,
  isCommonTransport,
  onModeChange,
  isLoading,
  onConfirmStatusChange
}: ActiveGearCardProps) => {
  const dispatch = useDispatch();
  const [name, setName] = useState('');

  const isDisabledCard = useMemo(
    () => isCommonTransport && idx === 2,
    [isCommonTransport, idx]
  );

  const onEmptyCardCLick = useCallback(() => {
    if (isDisabledCard) return;
    onConfirmStatusChange(true);
    onModeChange(true);
  }, [isDisabledCard]);

  const onCollectionItemSelect = ({
    type,
    src,
    rarity
  }: {
    type: string;
    src: string;
    rarity: string;
  }) => {
    dispatch(selectCollectionItemToDisplay({ type, id: src, rarity }));
    dispatch(toggleGearPopup(true));
  };

  useEffect(() => {
    if (gearData?.src?.length) {
      (async () => {
        try {
          const resp = await fetch(gearData.src);
          const data = await resp.json();
          setName(data.name);
        } catch (err) {}
      })();
    }
  }, [gearData]);

  if (isLoading) {
    return (
      <GearCardOuterWrapper>
        <EmptyGearCardWrapper>
          <Loader />
        </EmptyGearCardWrapper>
      </GearCardOuterWrapper>
    );
  }

  if (!gearData || isDisabledCard)
    return (
      <GearCardOuterWrapper>
        <EmptyGearCardWrapper onClick={onEmptyCardCLick}>
          {isDisabledCard ? <LockerIcon /> : <PlusIcon />}
        </EmptyGearCardWrapper>
        <GearCardLabel>Empty gear</GearCardLabel>
      </GearCardOuterWrapper>
    );

  return (
    <GearCardOuterWrapper onClick={onEmptyCardCLick}>
      <ActiveGearCardWrapper bgImg={`${gearData.src}.jpg`} />
      <GearCardLabel>{name ?? 'Loading...'}</GearCardLabel>

      <LootboxCardSignWrapper
        onClick={(e) => {
          e.stopPropagation();
          onCollectionItemSelect({
            src: gearData.id,
            rarity: gearData.rarity,
            type: COLLECTION_ITEMS_TYPES.gear
          });
        }}
      >
        i
      </LootboxCardSignWrapper>
    </GearCardOuterWrapper>
  );
};
