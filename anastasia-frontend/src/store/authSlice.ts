// src/store/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@/lib/axios";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

// Kullanıcı Girişi
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (formData: { email: string; password: string }, thunkAPI) => {
    try {
      const response = await axios.post("/users/login", formData);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// Kullanıcı Kaydı
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (formData: { name: string; email: string; password: string }, thunkAPI) => {
    try {
      const response = await axios.post("/users/register", formData);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Register failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      const { user } = action.payload;
      state.loading = false;
      state.user = {
        _id: user._id,
        name: user.name,
        email: user.email,
      };
      state.token = user.token;
      localStorage.setItem("token", user.token);
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
      const { user } = action.payload;
      state.loading = false;
      state.user = {
        _id: user._id,
        name: user.name,
        email: user.email,
      };
      state.token = user.token;
      localStorage.setItem("token", user.token);
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
