import { useSelector } from 'react-redux';
import {
  isGearModalSelector,
  isMyLandSelector,
  myLandPageSelector
} from '@selectors/appPartsSelectors';
import {
  cartItemsSelector,
  cartStateSelector
} from '@selectors/cartSliceSelectors';

const useAppParts = () => {
  const isLandsSidebarOpened = useSelector(isMyLandSelector);
  const currentLandsPage = useSelector(myLandPageSelector);
  const isCartOpened = useSelector(cartStateSelector);
  const cartItems = useSelector(cartItemsSelector) ?? [];
  const isGearModalOpened = useSelector(isGearModalSelector);

  return {
    isLandsSidebarOpened,
    currentLandsPage,
    isCartOpened,
    cartItems,
    isGearModalOpened
  };
};

export default useAppParts;
