import { createSlice } from '@reduxjs/toolkit';

export interface CartInterface {
  cartItems: string[];
  isCartOpen: boolean;
  isClaimingInCart: boolean;
}

const initialState: CartInterface = {
  cartItems: [],
  isCartOpen: false,
  isClaimingInCart: false
};

export const cartSlice = createSlice({
  name: 'Cart Handler',
  initialState,
  reducers: {
    addItemToCart: (state, action) => {
      state.cartItems = [...action.payload];
    },
    toggleCartSidebar: (state, action) => {
      state.isCartOpen = action.payload;
    },
    resetCart: (state) => {
      state.cartItems = [];
    },
    deleteItemFromChart: (state, action) => {
      state.cartItems = state.cartItems.filter((i) => i !== action.payload);
    },
    setClaimingCartStatus: (state, action) => {
      state.isClaimingInCart = action.payload;
    }
  }
});

export const {
  addItemToCart,
  toggleCartSidebar,
  resetCart,
  deleteItemFromChart,
  setClaimingCartStatus
} = cartSlice.actions;

export default cartSlice.reducer;
