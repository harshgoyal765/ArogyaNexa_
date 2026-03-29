export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  mfaCode?: string;
}

export interface AuthResponse {
  accessToken?: string;
  refreshToken?: string;
  tokenType?: string;
  expiresIn?: number;
  uuid?: string;
  email?: string;
  fullName?: string;
  roles?: string[];
  mfaRequired?: boolean;
  mfaSessionToken?: string;
}

export interface UserProfileResponse {
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  mfaEnabled: boolean;
  emailVerified: boolean;
  roles: string[];
  permissions: string[];
  lastLoginAt: string;
  createdAt: string;
  passwordExpired: boolean;
}

export interface MfaSetupResponse {
  secret: string;
  qrCodeUrl: string;
  manualEntryKey: string;
}
