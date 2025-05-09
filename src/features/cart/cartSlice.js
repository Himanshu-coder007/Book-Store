import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: JSON.parse(localStorage.getItem("cartItems")) || [],
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
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((id) => id !== action.payload);
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem("cartItems");
    },
  },
});

export const { toggleCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
