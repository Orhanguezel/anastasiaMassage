import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiCall from "@/lib/apiCall";
import API from "@/lib/api";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive?: boolean;
  profileImage: string;
  phone?: string;
  bio?: string;
  birthDate?: string;
  addresses?: string[];
  socialMedia?: Record<string, string>;
  notifications?: Record<string, any>;
}

interface UserState {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: UserState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
  successMessage: null,
};

// 📋 Alle Benutzer abrufen
export const fetchUsers = createAsyncThunk(
  "userCrud/fetchUsers",
  async (_, thunkAPI) =>
    await apiCall("get", "/users/users", null, thunkAPI.rejectWithValue)
);

// 👤 Einzelner Benutzer (nach ID)
export const fetchUserById = createAsyncThunk(
  "userCrud/fetchUserById",
  async (id: string, thunkAPI) =>
    await apiCall("get", `/users/users/${id}`, null, thunkAPI.rejectWithValue)
);

// ✏️ Benutzer aktualisieren (inkl. Profilbild)
export const updateUser = createAsyncThunk(
  "userCrud/updateUser",
  async (
    payload: { id: string; formData: FormData },
    thunkAPI
  ) => {
    try {
      const response = await API.put(`/users/users/${payload.id}`, payload.formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.user;
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data ||
        error?.message ||
        "Fehler beim Aktualisieren des Benutzers.";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ❌ Benutzer löschen
export const deleteUser = createAsyncThunk(
  "userCrud/deleteUser",
  async (id: string, thunkAPI) =>
    await apiCall("delete", `/users/users/${id}`, null, thunkAPI.rejectWithValue)
);

const userCrudSlice = createSlice({
  name: "userCrud",
  initialState,
  reducers: {
    clearUserCrudMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all users
    builder.addCase(fetchUsers.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action.payload;
    });
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch single user
    builder.addCase(fetchUserById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchUserById.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedUser = action.payload;
    });
    builder.addCase(fetchUserById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update user
    builder.addCase(updateUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.loading = false;
      state.successMessage = "Benutzer wurde erfolgreich aktualisiert.";
      const updatedUser = action.payload;
      state.users = state.users.map((u) =>
        u._id === updatedUser._id ? updatedUser : u
      );
      if (state.selectedUser?._id === updatedUser._id) {
        state.selectedUser = updatedUser;
      }
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete user
    builder.addCase(deleteUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.loading = false;
      state.successMessage = "Benutzer wurde erfolgreich gelöscht.";
      const deletedId = action.meta.arg;
      state.users = state.users.filter((u) => u._id !== deletedId);
    });
    builder.addCase(deleteUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearUserCrudMessages } = userCrudSlice.actions;
export default userCrudSlice.reducer;
