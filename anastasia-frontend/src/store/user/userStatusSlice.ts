import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiCall from "@/lib/apiCall";

interface UserStatusState {
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: UserStatusState = {
  loading: false,
  error: null,
  successMessage: null,
};

// ✅ Aktivierungsstatus umschalten (Toggle active/inactive)
export const toggleUserStatus = createAsyncThunk(
  "userStatus/toggleUserStatus",
  async (id: string, thunkAPI) =>
    await apiCall("put", `/users/users/${id}/status`, null, thunkAPI.rejectWithValue)
);

// ✅ Rolle aktualisieren (Update user role)
export const updateUserRole = createAsyncThunk(
  "userStatus/updateUserRole",
  async (
    payload: { id: string; role: string },
    thunkAPI
  ) =>
    await apiCall("put", `/users/users/${payload.id}/role`, { role: payload.role }, thunkAPI.rejectWithValue)
);

const userStatusSlice = createSlice({
  name: "userStatus",
  initialState,
  reducers: {
    clearUserStatusMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    // Toggle Active
    builder.addCase(toggleUserStatus.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(toggleUserStatus.fulfilled, (state, action) => {
      state.loading = false;
      const isActive = action.payload.isActive;
      state.successMessage = isActive
        ? "Benutzer wurde aktiviert."
        : "Benutzer wurde blockiert.";
    });
    builder.addCase(toggleUserStatus.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update Role
    builder.addCase(updateUserRole.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateUserRole.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "Benutzerrolle wurde erfolgreich aktualisiert.";
      });
      
    builder.addCase(updateUserRole.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearUserStatusMessages } = userStatusSlice.actions;
export default userStatusSlice.reducer;
