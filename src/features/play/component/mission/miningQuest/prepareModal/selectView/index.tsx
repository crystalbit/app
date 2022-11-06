import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { COLLECTION_ITEMS_TYPES } from '@features/lootboxes/types';
import {
  CategoryGridColumn,
  EmptyColumnPlaceholder,
  GearItemImgWrapper,
  GearItemWrapper,
  PrepareModalSubText,
  PrepareModalTitle,
  PrepareModalWrapper,
  SelectModeCategoryGrid,
  SelectModeModalText,
  TickTextWrapper
} from '@features/play/component/mission/miningQuest/prepareModal/prepareModal.styles';
import { LootboxCardSignWrapper } from '@features/play/component/storage/lootbox/lootboxItem.styles';
import useMining from '@features/play/hooks/useMining';
import { GearItemType } from '@features/play/types';
import { mapKeyToGearTitle } from '@features/play/utils';
import Button from '@global/components/button';
import { MOBILE_BREAKPOINT } from '@global/constants';
import useMediaQuery from '@global/hooks/useMediaQuery';
import { TickIcon } from '@images/icons/TickIcon';
import { toggleGearPopup } from '@slices/appPartsSlice';
import { selectCollectionItemToDisplay } from '@slices/lootboxesSlice';
import { equipMiningGear } from '@slices/questSlice';

type PrepareSelectViewType = {
  gears: Record<string, GearItemType[]>;
  isDefaultTransport?: boolean;
};

export const PrepareSelectView = ({
  gears,
  isDefaultTransport
}: PrepareSelectViewType) => {
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT}px)`);
  const { selectedMiningGear } = useMining();

  const gearsCount = useMemo(() => {
    return Object.values(gears).reduce((acc, val) => acc + val.length, 0);
  }, [gears]);

  const isEmptyList = gearsCount === 0;

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

  const isSelectedItem = (src: string) => {
    return Object.values(selectedMiningGear)
      .map((i) => (!i ? i : i?.src))
      .includes(src);
  };

  const maxCount = isDefaultTransport ? 2 : 3;

  const isButtonsDisabled =
    maxCount <=
    Object.values(selectedMiningGear ?? {})?.filter((i) => !!i)?.length;

  return (
    <PrepareModalWrapper minHeight="70vh" vAlign="flex-start" gap="25px">
      <PrepareModalTitle>{`My gear: ${gearsCount}`}</PrepareModalTitle>
      {isMobile && (
        <PrepareModalSubText>
          You can choose up to {maxCount} gear but only <br />1 from each
          category
        </PrepareModalSubText>
      )}
      {isEmptyList && (
        <SelectModeModalText>
          You dont have any gear,
          <br /> you can get one from utility crate
        </SelectModeModalText>
      )}
      {!isEmptyList && (
        <SelectModeCategoryGrid>
          {Object.values(gears).map((category, idx) => (
            <CategoryGridColumn key={Object.keys(gears)?.[idx]}>
              <SelectModeModalText>
                {mapKeyToGearTitle(Object.keys(gears)?.[idx])}
              </SelectModeModalText>
              {category.map(({ src = '', rarity, id = '', locked }) => {
                const isSelected = isSelectedItem(src);
                return (
                  <GearItemWrapper isSelected={isSelected} key={src}>
                    <GearItemImgWrapper
                      key={src}
                      bgImg={`${src}.jpg` ?? ''}
                      isLocked={locked}
                    >
                      <LootboxCardSignWrapper
                        onClick={() =>
                          onCollectionItemSelect({
                            src: id,
                            rarity,
                            type: COLLECTION_ITEMS_TYPES.gear
                          })
                        }
                      >
                        i
                      </LootboxCardSignWrapper>
                    </GearItemImgWrapper>
                    <Button
                      onClick={() =>
                        dispatch(
                          equipMiningGear({
                            // @ts-ignore
                            category: Object.keys(gears)[idx],
                            item: { src, rarity, id },
                            withReplace: true,
                            maxCount
                          })
                        )
                      }
                      text={
                        isSelected ? (
                          <TickTextWrapper>
                            <TickIcon />
                            <span>SELECTED</span>
                          </TickTextWrapper>
                        ) : (
                          'SELECT TO PLAY'
                        )
                      }
                      variant="common"
                      disabled={isButtonsDisabled && !isSelected}
                      disabledText="Limit exceeded"
                    />
                  </GearItemWrapper>
                );
              })}
              {!category.length && (
                <EmptyColumnPlaceholder>
                  <p>Empty</p>
                </EmptyColumnPlaceholder>
              )}
            </CategoryGridColumn>
          ))}
        </SelectModeCategoryGrid>
      )}
    </PrepareModalWrapper>
  );
};
