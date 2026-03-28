import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  headers: { "Content-Type": "application/json" },
});

export interface ApiResponse<T = undefined> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export const authApi = {
  sendOtp: (payload: { firstName: string; lastName: string; email: string }) =>
    api.post<ApiResponse>("/api/auth/send-otp", payload),

  verifyOtp: (payload: { email: string; otp: string }) =>
    api.post<ApiResponse>("/api/auth/verify-otp", payload),
};

export const profileApi = {
  complete: (payload: object) =>
    api.post<ApiResponse>("/api/profile/complete", payload),
};

export default api;
