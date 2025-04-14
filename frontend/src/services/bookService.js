import axios from 'axios';

// Use the backend URL from the environment variable
const API = import.meta.env.VITE_BACKEND_URL;


// Helper function to get the auth header
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Get all books with optional filters
const getAllBooks = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (filters.search) queryParams.append("search", filters.search);
    if (filters.location) queryParams.append("location", filters.location);
    if (filters.minPrice) queryParams.append("minPrice", filters.minPrice);
    if (filters.maxPrice) queryParams.append("maxPrice", filters.maxPrice);
    if (filters.language) queryParams.append("language", filters.language);
    if (filters.condition) queryParams.append("condition", filters.condition);
    
    const url = `${API}?${queryParams.toString()}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
};

// Get a book by ID
const getBookById = async (id) => {
  try {
    const response = await axios.get(`${API}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching book:", error);
    throw error;
  }
};

// Create a new book listing
const createBook = async (bookData) => {
  try {
    const formData = new FormData();
    Object.keys(bookData).forEach((key) => {
      // Map the file field to 'image' as expected by the backend
      if (key === "bookImage") {
        formData.append("image", bookData.bookImage);
      } else {
        formData.append(key, bookData[key]);
      }
    });
    const response = await axios.post(`${API}/list`, formData, {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating book listing:", error);
    throw error;
  }
};

// Update a book listing
const updateBook = async (id, bookData) => {
  try {
    const formData = new FormData();
    Object.keys(bookData).forEach((key) => {
      if (key === "bookImage" && bookData.bookImage) {
        formData.append("image", bookData.bookImage);
      } else if (bookData[key] !== undefined) {
        formData.append(key, bookData[key]);
      }
    });
    const response = await axios.put(`${API}/${id}`, formData, {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating book:", error);
    throw error;
  }
};

// Delete a book listing
const deleteBook = async (id) => {
  try {
    const response = await axios.delete(`${API}/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting book:", error);
    throw error;
  }
};

// Send message to seller
const sendMessageToSeller = async (bookId, messageData) => {
  try {
    const response = await axios.post(`${API}/${bookId}/message`, messageData, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

const bookService = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  sendMessageToSeller,
};

export default bookService;
