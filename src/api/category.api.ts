import axiosClient from "../utils/axiosClient";
import type { Category, GetAllCategoryResponse } from "../types/category";
import { mockCategories } from "../data/mock/category.mock";
import { API_URL } from "../config/config";

const USE_MOCK = true; //  Đổi sang false khi có API thật

export const categoryApi = {
  async getAll(): Promise<Category[]> {
    if (USE_MOCK) {
      console.log("[MOCK] categoryApi.getAll()");
      await new Promise((r) => setTimeout(r, 300));
      return mockCategories;
    }

    const res = await axiosClient.get("/categories");
    return res.data;
  },

  getAllCategory: async (): Promise<GetAllCategoryResponse> => {
    console.log(`${API_URL}/Category/get-all`)

    const response = await axiosClient.get<GetAllCategoryResponse>(`${API_URL}/Category/get-all`);
    return response.data
  },

};
