import api from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type { AuthResponse, LoginRequest, RegisterRequest, UserProfileResponse } from '@/types/auth';
import { getDemoAuthResponse } from '@/lib/demoAuth';

export const authApi = {
  register: (data: RegisterRequest) =>
    api.post<ApiResponse<UserProfileResponse>>('/api/v1/auth/register', data),

  login: (data: LoginRequest) => {
    const demo = getDemoAuthResponse(data.email, data.password);
    if (demo) {
      // Return a resolved promise shaped like an axios response
      return Promise.resolve({
        data: { success: true, message: 'Demo login successful', data: demo } as ApiResponse<AuthResponse>,
      });
    }
    return api.post<ApiResponse<AuthResponse>>('/api/v1/auth/login', data);
  },

  mfaVerify: (mfaSessionToken: string, mfaCode: string) =>
    api.post<ApiResponse<AuthResponse>>('/api/v1/auth/mfa/verify', { mfaSessionToken, mfaCode }),

  refresh: (refreshToken: string) =>
    api.post<ApiResponse<AuthResponse>>('/api/v1/auth/refresh', { refreshToken }),

  logout: () =>
    api.post('/api/v1/auth/logout'),

  forgotPassword: (email: string) =>
    api.post('/api/v1/auth/forgot-password', { email }),

  resetPassword: (token: string, newPassword: string) =>
    api.post('/api/v1/auth/reset-password', { token, newPassword }),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.post('/api/v1/auth/change-password', { currentPassword, newPassword }),

  getProfile: () =>
    api.get<ApiResponse<UserProfileResponse>>('/api/v1/users/me'),
};
