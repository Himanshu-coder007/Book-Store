// src/features/likes/likesSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  likedBooks: JSON.parse(localStorage.getItem("likedBooks")) || [],
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
      localStorage.setItem("likedBooks", JSON.stringify(state.likedBooks));
    },
    clearLikes: (state) => {
      state.likedBooks = [];
      localStorage.removeItem("likedBooks");
    },
  },
});

export const { toggleLike, clearLikes } = likesSlice.actions;
export default likesSlice.reducer;
