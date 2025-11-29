import axiosClient from "../utils/axiosClient";
import type { AddCategoryRequest, Category, CategoryResponse, DeleteCategoryResponse, GetAllCategoryResponse, UpdateCategoryRequest } from "../types/category";
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
    const response = await axiosClient.get<GetAllCategoryResponse>(`${API_URL}/Category/get-all`);
    return response.data
  },

  add: async (req: AddCategoryRequest): Promise<CategoryResponse> => {
    const response = await axiosClient.post<CategoryResponse>(`${API_URL}/Category/add`, req);
    return response.data
  },

  update: async (req: UpdateCategoryRequest): Promise<CategoryResponse> => {
    const response = await axiosClient.post<CategoryResponse>(`${API_URL}/Category/update/${req.id}`, req);
    return response.data
  },

  delete: async (id: string): Promise<DeleteCategoryResponse> => {
    const response = await axiosClient.post<DeleteCategoryResponse>(`${API_URL}/Category/delete/${id}`);
    return response.data
  },
};
