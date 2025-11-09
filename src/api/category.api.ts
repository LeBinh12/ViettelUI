import axiosClient from "../utils/axiosClient";
import type { Category } from "../types/category";
import { mockCategories } from "../data/mock/category.mock";

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
};
