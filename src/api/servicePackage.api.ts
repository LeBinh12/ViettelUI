import axiosClient from "../utils/axiosClient";
import type { ServicePackage } from "../types/servicePackage";
import { mockServicePackages } from "../data/mock/servicePackage.mock";

const USE_MOCK = true; //  Đổi sang false khi có API thật

export const servicePackageApi = {
  // Lấy tất cả
  async getAll(): Promise<ServicePackage[]> {
    if (USE_MOCK) {
      console.log("[MOCK] servicePackageApi.getAll()");
      await new Promise((r) => setTimeout(r, 300));
      return mockServicePackages;
    }

    const res = await axiosClient.get("/service-packages");
    return res.data;
  },

  // Lấy theo category_id
  async getByCategory(categoryId: string): Promise<ServicePackage[]> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      return mockServicePackages.filter((p) => p.category_id === categoryId);
    }

    const res = await axiosClient.get(`/service-packages?category_id=${categoryId}`);
    return res.data;
  },

  // Lấy chi tiết 1 gói (nếu backend trả chung trong list)
  async getById(id: string): Promise<ServicePackage | null> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      return mockServicePackages.find((p) => p.id === id) || null;
    }

    const res = await axiosClient.get(`/service-packages/${id}`);
    return res.data;
  },
};
