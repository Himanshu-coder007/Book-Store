// utils/api.js
const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY; // Replace with your actual API key

export const fetchBookById = async (bookId) => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch book details");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching book:", error);
    return null;
  }
};
