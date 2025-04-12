// src/store/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiCall from "@/lib/apiCall";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  profileImage: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  successMessage: null,
};

// 🔐 Login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (formData: { email: string; password: string }, thunkAPI) =>
    await apiCall("post", "/users/login", formData, thunkAPI.rejectWithValue)
);

// 📝 Register
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (
    formData: { name: string; email: string; password: string },
    thunkAPI
  ) =>
    await apiCall("post", "/users/register", formData, thunkAPI.rejectWithValue)
);

// 🔒 Şifre değiştir
export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (
    formData: { currentPassword: string; newPassword: string },
    thunkAPI
  ) =>
    await apiCall("post", "/users/change-password", formData, thunkAPI.rejectWithValue)
);

// 🚪 Logout
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, thunkAPI) =>
    await apiCall("post", "/users/logout", null, thunkAPI.rejectWithValue)
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Register
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

   

    // Change Password
    builder.addCase(changePassword.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(changePassword.fulfilled, (state, action) => {
      state.loading = false;
      state.successMessage = action.payload || "Passwort erfolgreich geändert.";
    });
    builder.addCase(changePassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.successMessage = "Abmeldung erfolgreich / Logged out successfully.";
    });
    builder.addCase(logoutUser.rejected, (state, action) => {
      state.error = action.payload as string;
    });
  },
});

export const { clearAuthMessages } = authSlice.actions;
export default authSlice.reducer;
