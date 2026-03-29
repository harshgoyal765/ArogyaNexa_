import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '@/lib/api/auth';
import type { AuthResponse, LoginRequest, RegisterRequest, UserProfileResponse } from '@/types/auth';

interface AuthState {
  user: UserProfileResponse | null;
  accessToken: string | null;
  roles: string[];
  isLoading: boolean;
  error: string | null;
  mfaRequired: boolean;
  mfaSessionToken: string | null;
}

const initialState: AuthState = {
  user: typeof window !== 'undefined'
    ? (() => { try { return JSON.parse(localStorage.getItem('demoUser') || 'null'); } catch { return null; } })()
    : null,
  accessToken: typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null,
  roles: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('userRoles') || '[]') : [],
  isLoading: false,
  error: null,
  mfaRequired: false,
  mfaSessionToken: null,
};

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const { data } = await authApi.login(credentials);
      return data.data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const registerThunk = createAsyncThunk(
  'auth/register',
  async (payload: RegisterRequest, { rejectWithValue }) => {
    try {
      const { data } = await authApi.register(payload);
      return data.data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const fetchProfileThunk = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await authApi.getProfile();
      return data.data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<AuthResponse>) {
      const auth = action.payload;
      state.accessToken = auth.accessToken || null;
      state.roles = auth.roles || [];
      if (typeof window !== 'undefined') {
        if (auth.accessToken) localStorage.setItem('accessToken', auth.accessToken);
        if (auth.refreshToken) localStorage.setItem('refreshToken', auth.refreshToken);
        localStorage.setItem('userRoles', JSON.stringify(auth.roles || []));
      }
    },
    clearAuth(state) {
      state.user = null;
      state.accessToken = null;
      state.roles = [];
      state.mfaRequired = false;
      state.mfaSessionToken = null;
      if (typeof window !== 'undefined') localStorage.clear();
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const auth = action.payload;
        if (auth.mfaRequired) {
          state.mfaRequired = true;
          state.mfaSessionToken = auth.mfaSessionToken || null;
        } else {
          state.accessToken = auth.accessToken || null;
          state.roles = auth.roles || [];
          // For demo logins, build a mock user profile from the auth response
          if (auth.accessToken?.startsWith('demo-token-') && auth.fullName) {
            const [firstName, ...rest] = auth.fullName.split(' ');
            state.user = {
              uuid: auth.uuid || 'demo-uuid',
              firstName,
              lastName: rest.join(' ') || 'User',
              email: auth.email || 'demo@ArogyaNexa.com',
              mfaEnabled: false,
              emailVerified: true,
              roles: auth.roles || [],
              permissions: [],
              lastLoginAt: new Date().toISOString(),
              createdAt: new Date().toISOString(),
              passwordExpired: false,
            };
            if (typeof window !== 'undefined') {
              localStorage.setItem('demoUser', JSON.stringify(state.user));
            }
          }
          if (typeof window !== 'undefined') {
            if (auth.accessToken) localStorage.setItem('accessToken', auth.accessToken);
            if (auth.refreshToken) localStorage.setItem('refreshToken', auth.refreshToken);
            localStorage.setItem('userRoles', JSON.stringify(auth.roles || []));
          }
        }
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(registerThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProfileThunk.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { setAuth, clearAuth, clearError } = authSlice.actions;
export default authSlice.reducer;
