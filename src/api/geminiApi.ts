import { API_URL } from "../config/config";
import type { GeminiResponse } from "../types/gemini";
import axiosClient from "../utils/axiosClient";

export const geminiApi = {
    response: async (prompt: string): Promise<GeminiResponse> => {
        return axiosClient.post<GeminiResponse>(`${API_URL}/Gemini/ask`, {
            prompt: prompt
        }).then(res => res.data);
    },

}