import { RootState } from '@redux/store';

export const cartItemsSelector = (state: RootState) => state.cart.cartItems;

export const cartStateSelector = (state: RootState) => state.cart.isCartOpen;

export const cartClaimingSelector = (state: RootState) =>
  state.cart.isClaimingInCart;
