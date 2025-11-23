import axiosClient from "../utils/axiosClient";
import type { ServicePackageAddRequest, ServicePackageAddResponse, ServicePackageByIdResponse, ServicePackageDeleteResponse, ServicePackageResponse, ServicePackageUpdateRequest } from "../types/servicePackage";
import { API_URL } from "../config/config";

export const servicePackageApi = {


  // Lấy tất cả
  getAll: async (): Promise<ServicePackageResponse> => {
    console.log(`${API_URL}/ServicePackage/get-all`)
    const response = await axiosClient.get<ServicePackageResponse>(`${API_URL}/ServicePackage/get-all`);
    return response.data
  },

  getById: async (id: string): Promise<ServicePackageByIdResponse> => {
    const response = await axiosClient.get<ServicePackageByIdResponse>(`${API_URL}/ServicePackage/get-by-id/${id}`);
    return response.data
  },

  getByCategory: async (id: string): Promise<ServicePackageResponse> => {
    const response = await axiosClient.get<ServicePackageResponse>(`${API_URL}/ServicePackage/get-by-category/${id}`);
    return response.data
  },

  add: async (req: ServicePackageAddRequest): Promise<ServicePackageAddResponse> => {
    const response = await axiosClient.post<ServicePackageAddResponse>(`${API_URL}/ServicePackage/add`, req);
    return response.data
  },

  update: async (req: ServicePackageUpdateRequest): Promise<ServicePackageAddResponse> => {
    const response = await axiosClient.post<ServicePackageAddResponse>(`${API_URL}/ServicePackage/update/${req.id}`, req);
    return response.data
  },

  delete: async (id: string): Promise<ServicePackageDeleteResponse> => {
    const response = await axiosClient.post<ServicePackageDeleteResponse>(`${API_URL}/ServicePackage/delete/${id}`);
    return response.data
  },

};
