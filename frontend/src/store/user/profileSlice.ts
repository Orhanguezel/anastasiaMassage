// src/store/profileSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiCall from "@/lib/apiCall";
import API from "@/lib/api";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  phone?: string;
  addresses?: string[];
  profileImage: string;
}

interface ProfileState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
  successMessage: null,
};

// 👤 Profil getir
export const getUserProfile = createAsyncThunk(
  "profile/getUserProfile",
  async (_, thunkAPI) =>
    await apiCall("get", "/account/me", null, thunkAPI.rejectWithValue)
);

// 📝 Profili güncelle
export const updateUserProfile = createAsyncThunk(
  "profile/updateUserProfile",
  async (
    formData: { name: string; email: string; phone?: string; addresses?: string[] },
    thunkAPI
  ) =>
    await apiCall("put", "/users/account/me/update", formData, thunkAPI.rejectWithValue)
);

// 🖼️ Profil resmi güncelle (multipart/form-data)
export const updateProfileImage = createAsyncThunk(
  "profile/updateProfileImage",
  async (
    payload: { userId: string; file: File },
    thunkAPI
  ) => {
    try {
      const formData = new FormData();
      formData.append("profileImage", payload.file);

      const response = await API.put(
        `/users/${payload.userId}/profile-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data.profileImage;
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data ||
        error?.message ||
        "Fehler beim Hochladen des Profilbildes.";

      return thunkAPI.rejectWithValue(message);
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfileMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    // GET PROFILE
    builder.addCase(getUserProfile.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getUserProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.profile = action.payload;
    });
    builder.addCase(getUserProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // UPDATE PROFILE
    builder.addCase(updateUserProfile.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateUserProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.profile = action.payload.user;
      state.successMessage = "Profil wurde erfolgreich aktualisiert.";
    });
    builder.addCase(updateUserProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // UPDATE PROFILE IMAGE
    builder.addCase(updateProfileImage.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateProfileImage.fulfilled, (state, action) => {
      state.loading = false;
      if (state.profile) {
        state.profile.profileImage = action.payload;
      }
      state.successMessage = "Profilbild wurde erfolgreich aktualisiert.";
    });
    builder.addCase(updateProfileImage.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearProfileMessages } = profileSlice.actions;
export default profileSlice.reducer;
