import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  likedBooks: [],
};

const likesSlice = createSlice({
  name: "likes",
  initialState,
  reducers: {
    toggleLike: (state, action) => {
      const bookId = action.payload;
      if (state.likedBooks.includes(bookId)) {
        state.likedBooks = state.likedBooks.filter((id) => id !== bookId);
      } else {
        state.likedBooks.push(bookId);
      }
    },
    clearLikes: (state) => {
      state.likedBooks = [];
    },
    initializeLikes: (state, action) => {
      state.likedBooks = action.payload || [];
    },
  },
});

export const { toggleLike, clearLikes, initializeLikes } = likesSlice.actions;
export default likesSlice.reducer;
