import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    toggleCart: (state, action) => {
      const bookId = action.payload;
      if (state.cartItems.includes(bookId)) {
        state.cartItems = state.cartItems.filter((id) => id !== bookId);
      } else {
        state.cartItems.push(bookId);
      }
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((id) => id !== action.payload);
    },
    clearCart: (state) => {
      state.cartItems = [];
    },
    initializeCart: (state, action) => {
      state.cartItems = action.payload || [];
    },
  },
});

export const { toggleCart, removeFromCart, clearCart, initializeCart } =
  cartSlice.actions;
export default cartSlice.reducer;
