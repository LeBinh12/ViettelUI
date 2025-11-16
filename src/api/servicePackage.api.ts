import axiosClient from "../utils/axiosClient";
import type { ServicePackage, ServicePackageResponse } from "../types/servicePackage";
import { mockServicePackages } from "../data/mock/servicePackage.mock";
import { API_URL } from "../config/config";

const USE_MOCK = true; //  Đổi sang false khi có API thật

export const servicePackageApi = {


  // Lấy tất cả
  getAll: async (): Promise<ServicePackageResponse> => {
    const response = await axiosClient.get<ServicePackageResponse>(`${API_URL}/ServicePackage/get-all`);
    return response.data
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
