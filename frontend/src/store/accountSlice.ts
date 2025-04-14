// src/store/accountSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apiCall from "@/lib/apiCall";

// 🛠️ Type tanımları
interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
}

interface SocialMediaLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
}

interface Account {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  profileImage?: string;
  address?: string;
  notifications?: NotificationSettings;
  socialMedia?: SocialMediaLinks;
}

interface AccountState {
  profile: Account | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: AccountState = {
  profile: null,
  loading: false,
  error: null,
  successMessage: null,
};

// 🔄 Async işlemler (Thunk'lar)

// 👤 Aktif kullanıcıyı getir
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, thunkAPI) =>
    await apiCall("get", "/account/me", null, thunkAPI.rejectWithValue)
);

// Profil bilgileri güncelleme
export const updateMyProfile = createAsyncThunk(
  "account/updateMyProfile",
  async (data: { name?: string; email?: string; phone?: string }, thunkAPI) =>
    await apiCall("put", "/account/me/update", data, thunkAPI.rejectWithValue)
);

// Şifre güncelleme
export const updateMyPassword = createAsyncThunk(
  "account/updateMyPassword",
  async (data: { currentPassword: string; newPassword: string }, thunkAPI) =>
    await apiCall("put", "/account/me/password", data, thunkAPI.rejectWithValue)
);

// Bildirim ayarlarını güncelleme
export const updateNotificationSettings = createAsyncThunk(
  "account/updateNotificationSettings",
  async (data: NotificationSettings, thunkAPI) =>
    await apiCall("patch", "/account/me/notifications", data, thunkAPI.rejectWithValue)
);

// Sosyal medya linklerini güncelleme
export const updateSocialMediaLinks = createAsyncThunk(
  "account/updateSocialMediaLinks",
  async (data: SocialMediaLinks, thunkAPI) =>
    await apiCall("patch", "/account/me/social", data, thunkAPI.rejectWithValue)
);

// 🔧 Slice tanımı
const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    clearAccountMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    const loading = (state: AccountState) => {
      state.loading = true;
      state.error = null;
    };

    const failed = (state: AccountState, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    };

    builder
      // Profil güncelleme
      .addCase(updateMyProfile.pending, loading)
      .addCase(updateMyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.user;
        state.successMessage = action.payload.message;
      })
      .addCase(updateMyProfile.rejected, failed);

    // Şifre güncelleme
    builder
      .addCase(updateMyPassword.pending, loading)
      .addCase(updateMyPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(updateMyPassword.rejected, failed);

    // Bildirim güncelleme
    builder
      .addCase(updateNotificationSettings.pending, loading)
      .addCase(updateNotificationSettings.fulfilled, (state, action) => {
        state.loading = false;
        if (state.profile)
          state.profile.notifications = action.payload.notifications;
        state.successMessage = action.payload.message;
      })
      .addCase(updateNotificationSettings.rejected, failed);

    // Sosyal medya güncelleme
    builder
      .addCase(updateSocialMediaLinks.pending, loading)
      .addCase(updateSocialMediaLinks.fulfilled, (state, action) => {
        state.loading = false;
        if (state.profile)
          state.profile.socialMedia = action.payload.socialMedia;
        state.successMessage = action.payload.message;
      })
      .addCase(updateSocialMediaLinks.rejected, failed);

    // Aktif kullanıcıyı getir
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })      
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Exportlar
export const { clearAccountMessages } = accountSlice.actions;
export default accountSlice.reducer;
