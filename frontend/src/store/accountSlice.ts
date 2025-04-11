import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apiCall from "@/lib/apiCall";

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

// Thunks
export const fetchMyProfile = createAsyncThunk("account/fetchMyProfile", async (_, thunkAPI) =>
  await apiCall("get", "/account/profile", null, thunkAPI.rejectWithValue)
);

export const updateMyProfile = createAsyncThunk(
  "account/updateMyProfile",
  async (data: { name?: string; email?: string; phone?: string }, thunkAPI) =>
    await apiCall("put", "/account/profile", data, thunkAPI.rejectWithValue)
);

export const updateMyPassword = createAsyncThunk(
  "account/updateMyPassword",
  async (data: { currentPassword: string; newPassword: string }, thunkAPI) =>
    await apiCall("put", "/account/password", data, thunkAPI.rejectWithValue)
);

export const updateNotificationSettings = createAsyncThunk(
  "account/updateNotificationSettings",
  async (data: NotificationSettings, thunkAPI) =>
    await apiCall("put", "/account/notifications", data, thunkAPI.rejectWithValue)
);

export const updateSocialMediaLinks = createAsyncThunk(
  "account/updateSocialMediaLinks",
  async (data: SocialMediaLinks, thunkAPI) =>
    await apiCall("put", "/account/social", data, thunkAPI.rejectWithValue)
);

// Slice
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
      .addCase(fetchMyProfile.pending, loading)
      .addCase(fetchMyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchMyProfile.rejected, failed);

    builder
      .addCase(updateMyProfile.pending, loading)
      .addCase(updateMyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.user;
        state.successMessage = action.payload.message;
      })
      .addCase(updateMyProfile.rejected, failed);

    builder
      .addCase(updateMyPassword.pending, loading)
      .addCase(updateMyPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(updateMyPassword.rejected, failed);

    builder
      .addCase(updateNotificationSettings.pending, loading)
      .addCase(updateNotificationSettings.fulfilled, (state, action) => {
        state.loading = false;
        if (state.profile) state.profile.notifications = action.payload.notifications;
        state.successMessage = action.payload.message;
      })
      .addCase(updateNotificationSettings.rejected, failed);

    builder
      .addCase(updateSocialMediaLinks.pending, loading)
      .addCase(updateSocialMediaLinks.fulfilled, (state, action) => {
        state.loading = false;
        if (state.profile) state.profile.socialMedia = action.payload.socialMedia;
        state.successMessage = action.payload.message;
      })
      .addCase(updateSocialMediaLinks.rejected, failed);
  },
});

export const { clearAccountMessages } = accountSlice.actions;
export default accountSlice.reducer;
