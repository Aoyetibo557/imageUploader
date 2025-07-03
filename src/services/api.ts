import axios from "axios";
import { Image, ImageUpload } from "../types";

const API_BASE_URL = "http://localhost:3001";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const imageService = {
  // Get all images
  getAllImages: async (): Promise<Image[]> => {
    const response = await api.get("/images");
    return response.data;
  },

  // Search images by name
  searchImages: async (searchTerm: string): Promise<Image[]> => {
    const response = await api.get(`/images?name_like=${searchTerm}`);
    return response.data;
  },

  // Upload/Create new image
  uploadImage: async (imageData: ImageUpload): Promise<Image> => {
    const response = await api.post("/images", imageData);
    return response.data;
  },

  // Delete image
  deleteImage: async (id: number): Promise<void> => {
    await api.delete(`/images/${id}`);
  },

  // Rename image
  renameImage: async (image: Image): Promise<Image> => {
    const response = await api.patch(`/images/${image.id}`, {
      name: image.name,
    });
    return response.data;
  },

  // Convert file to base64 URL for mock storage
  fileToBase64: (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  },
};
