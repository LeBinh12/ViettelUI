import { API_URL } from "../config/config";
import type { LoginRequest, LoginResponse } from "../types/auth";
import axiosClient from "../utils/axiosClient";

//  Định nghĩa thêm kiểu dữ liệu cho đăng ký
export interface RegisterRequest {
  username: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  data?: any;
}

export const authApi = {
  // API Đăng nhập
  login: async (payload: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosClient.post<LoginResponse>(
      `${API_URL}/UserAccount/login`,
      payload
    );
    return response.data;
  },

  //  API Đăng ký
  register: async (payload: RegisterRequest): Promise<RegisterResponse> => {
    const response = await axiosClient.post<RegisterResponse>(
      `${API_URL}/UserAccount/register`,
      payload
    );
    return response.data;
  },
};
