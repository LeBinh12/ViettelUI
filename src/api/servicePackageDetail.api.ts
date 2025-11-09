import axiosClient from "../utils/axiosClient";
import type { ServicePackageDetail } from "../types/servicePackageDetail";
import { mockServicePackageDetails } from "../data/mock/servicePackageDetail.mock";

const USE_MOCK = true; //  Đổi sang false khi có API thật

export const servicePackageDetailApi = {
  // Lấy chi tiết theo id
  async getById(id: string): Promise<ServicePackageDetail | null> {
    if (USE_MOCK) {
      console.log("[MOCK] servicePackageDetailApi.getById()", id);
      await new Promise((r) => setTimeout(r, 300));
      return mockServicePackageDetails.find((x) => x.id === id) || null;
    }

    const res = await axiosClient.get(`/service-packages/${id}/detail`);
    return res.data;
  },

  // Lấy gói tương tự
  async getSimilar(id: string): Promise<ServicePackageDetail[]> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      const pkg = mockServicePackageDetails.find((x) => x.id === id);
      return pkg ? pkg.similar_packages as any : [];
    }

    const res = await axiosClient.get(`/service-packages/${id}/similar`);
    return res.data;
  },
};
