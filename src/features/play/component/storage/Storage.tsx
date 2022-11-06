import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import { useGears } from '@features/gear/hooks/useGears';
import { Loader } from '@features/global/components/loader/loader';
import useLootboxes from '@features/lootboxes/hooks/useLootboxes';
import { COLLECTION_ITEMS_TYPES } from '@features/lootboxes/types';
import { LIST_FILTER_TYPE } from '@features/play/types';
import useFlags from '@global/hooks/useFlags';
import usePersonalInfo from '@global/hooks/usePersonalInfo';
import { collectionLoader } from '@redux/selectors/lootboxesSliceSelectors';
import { trackUserEvent } from '@global/utils/analytics';

import { LootboxItem } from './lootbox/lootboxItem';
import {
  EmptyListText,
  Option,
  Select,
  StorageBlock,
  StorageContentBlock,
  StorageWrapper,
  Title,
  Wrapper
} from './storage.styles';

const Storage = () => {
  // UTILS
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const { isLootboxesAvailable } = useFlags();
  const loader = useSelector(collectionLoader);

  // DATA HOOKS
  const { address, isInitialized } = usePersonalInfo();
  const { getLootboxes, userLootboxes, clnyPrice } = useLootboxes();
  const { isMintingLoad, userGears, getUserGears } = useGears();

  // LOCAL STATE
  const [isLoaded, setIsLoaded] = useState(false);
  const [listFilter, setListFilter] = useState<string>(LIST_FILTER_TYPE.all);

  useEffect(() => {
    if (isLootboxesAvailable && isInitialized) {
      const gears = getUserGears();
      const lootboxes = getLootboxes();
      Promise.all([gears, lootboxes]).then(() => setIsLoaded(true));
    } else {
      setIsLoaded(true);
    }
  }, [addToast, dispatch, setIsLoaded, isInitialized]);

  let title = `Your storage: ${
    isLoaded && !loader
      ? (userLootboxes?.[0]?.length ?? 0) + (userGears?.[0]?.length ?? 0)
      : '...'
  }`;

  let lootBoxesList = useMemo(() => {
    const isItemsInCollection =
      userLootboxes?.['0'].length || userGears?.['0'].length;

    if (!isItemsInCollection)
      return <EmptyListText>NO ITEMS YET</EmptyListText>;

    const gears = userGears?.[0].map((id, idx) => (
      <LootboxItem
        src={userGears?.[0]?.[idx]}
        key={id}
        rarity={userGears?.[1]?.[idx].rarity}
        type={COLLECTION_ITEMS_TYPES.gear}
      />
    ));

    const lootboxes = userLootboxes?.[0].map((id, idx) => (
      <LootboxItem
        src={id}
        key={id}
        rarity={userLootboxes?.[1]?.[idx]}
        isPending={isMintingLoad.includes(id)}
        type={COLLECTION_ITEMS_TYPES.lootbox}
        activeItems={isMintingLoad}
        clnyPrice={clnyPrice?.rate ?? 0}
      />
    ));

    switch (listFilter) {
      case LIST_FILTER_TYPE.all:
        return (
          <>
            {gears}
            {lootboxes}
          </>
        );
      case LIST_FILTER_TYPE.gear:
        return <>{gears}</>;
      case LIST_FILTER_TYPE.lootboxes:
        return <>{lootboxes}</>;
      default:
        return (
          <>
            {gears}
            {lootboxes}
          </>
        );
    }
  }, [userLootboxes, isMintingLoad, userGears, listFilter, clnyPrice]);

  const content = () => {
    if (!address) return null;
    return isLoaded && !loader ? lootBoxesList : <Loader />;
  };

  return (
    <StorageWrapper>
      <StorageBlock>
        <Wrapper>
          <Title>{title}</Title>

          <Select
            onChange={({ target: { value } }) => {
              trackUserEvent('Storage filter chosen', { type: value });
              setListFilter(value);
            }}
            value={listFilter}
          >
            <Option value="all">All</Option>
            <Option value="lootboxes">Utility Crates</Option>
            <Option value="gears">Mission Gear</Option>
          </Select>
        </Wrapper>

        <StorageContentBlock>{content()}</StorageContentBlock>
      </StorageBlock>
    </StorageWrapper>
  );
};

export default Storage;
