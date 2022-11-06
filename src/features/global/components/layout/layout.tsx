import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ConnectionZone } from '@features/global/components/connectionZone/connectionZone';
import useMining from '@features/play/hooks/useMining';
import {
  ConnectionZoneWrapper,
  LayoutWrapper
} from '@global/components/layout/layout.styles';
import Sidebar from '@global/components/sidebar';
import { MOBILE_BREAKPOINT } from '@global/constants';
import useAppParts from '@global/hooks/useAppParts';
import useFlags from '@global/hooks/useFlags';
import usePersonalInfo from '@global/hooks/usePersonalInfo';
import useRoutes from '@global/hooks/useRoutes';
import { CartIcon } from '@images/icons/CartIcon';
import {
  CartIconCounter,
  MyAccountIconWrapper
} from '@root/legacy/navbar.styles';
import { cartItemsSelector } from '@selectors/cartSliceSelectors';
import { toggleMyLandPopup } from '@slices/appPartsSlice';
import useResizeObserver from 'use-resize-observer';

const Layout: FC = ({ children }) => {
  const dispatch = useDispatch();
  const { address, connect } = usePersonalInfo();
  const { ref: wrapperRef, width: containerWidth } = useResizeObserver();
  const { isLandsPage, isPlayPage, isProfilePage } = useRoutes();
  const { isMiningPrepareScreen: isHiddenUI } = useMining();
  const { isHarmonyChains } = useFlags();
  const { isCartOpened } = useAppParts();

  const isMobile = (containerWidth ?? 0) < MOBILE_BREAKPOINT;
  const cartItems = useSelector(cartItemsSelector) ?? [];

  const onOpenCart = () => {
    dispatch(toggleMyLandPopup('cart'));
  };

  const isCartButtonShown = isLandsPage && !isHarmonyChains;

  return (
    <LayoutWrapper ref={wrapperRef}>
      <ConnectionZoneWrapper isReplaced={isPlayPage || isProfilePage}>
        {isCartButtonShown && (
          <MyAccountIconWrapper
            onClick={onOpenCart}
            isCartOpened={isCartOpened}
          >
            <CartIconCounter>{cartItems.length}</CartIconCounter>
            <CartIcon />
          </MyAccountIconWrapper>
        )}
        {!isHiddenUI && (
          <ConnectionZone address={address} onConnect={connect} />
        )}
      </ConnectionZoneWrapper>
      {!isHiddenUI && <Sidebar isMobile={isMobile} />}
      {children}
    </LayoutWrapper>
  );
};

export default Layout;
