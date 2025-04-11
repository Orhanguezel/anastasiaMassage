import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiCall from "@/lib/apiCall";

interface Appointment {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  serviceType: string;
  service: any; // can be populated service object
  note?: string;
  date: string;
  time: string;
  status?: "pending" | "confirmed" | "cancelled";
  createdAt?: string;
}

interface AppointmentState {
  appointments: Appointment[];
  selectedAppointment: Appointment | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: AppointmentState = {
  appointments: [],
  selectedAppointment: null,
  loading: false,
  error: null,
  successMessage: null,
};

// 🗓️ Termin erstellen
export const createAppointment = createAsyncThunk(
  "appointments/createAppointment",
  async (
    formData: {
      name: string;
      email: string;
      phone?: string;
      serviceType: string;
      note?: string;
      date: string;
      time: string;
      service: string;
    },
    thunkAPI
  ) =>
    await apiCall("post", "/appointments", formData, thunkAPI.rejectWithValue)
);

// 📋 Alle Termine abrufen (admin)
export const fetchAppointments = createAsyncThunk(
  "appointments/fetchAppointments",
  async (_, thunkAPI) =>
    await apiCall("get", "/appointments", null, thunkAPI.rejectWithValue)
);

// 🔍 Einzelnen Termin abrufen
export const getAppointmentById = createAsyncThunk(
  "appointments/getAppointmentById",
  async (id: string, thunkAPI) =>
    await apiCall("get", `/appointments/${id}`, null, thunkAPI.rejectWithValue)
);

// 🔄 Terminstatus aktualisieren
export const updateAppointmentStatus = createAsyncThunk(
  "appointments/updateAppointmentStatus",
  async (
    payload: { id: string; status: string },
    thunkAPI
  ) =>
    await apiCall("put", `/appointments/${payload.id}/status`, { status: payload.status }, thunkAPI.rejectWithValue)
);

// 🗑️ Termin löschen
export const deleteAppointment = createAsyncThunk(
  "appointments/deleteAppointment",
  async (id: string, thunkAPI) =>
    await apiCall("delete", `/appointments/${id}`, null, thunkAPI.rejectWithValue)
);

const appointmentsSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    clearAppointmentMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    // CREATE
    builder.addCase(createAppointment.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createAppointment.fulfilled, (state, action) => {
      state.loading = false;
      state.successMessage = "Termin wurde erfolgreich erstellt.";
      state.appointments.push(action.payload.appointment);
    });
    builder.addCase(createAppointment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // FETCH ALL
    builder.addCase(fetchAppointments.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchAppointments.fulfilled, (state, action) => {
      state.loading = false;
      state.appointments = action.payload;
    });
    builder.addCase(fetchAppointments.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // GET BY ID
    builder.addCase(getAppointmentById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAppointmentById.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedAppointment = action.payload;
    });
    builder.addCase(getAppointmentById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // UPDATE STATUS
    builder.addCase(updateAppointmentStatus.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateAppointmentStatus.fulfilled, (state, action) => {
      state.loading = false;
      const updated = action.payload.appointment;
      state.successMessage = "Status wurde aktualisiert.";
      state.appointments = state.appointments.map((a) =>
        a._id === updated._id ? updated : a
      );
    });
    builder.addCase(updateAppointmentStatus.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // DELETE
    builder.addCase(deleteAppointment.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteAppointment.fulfilled, (state, action) => {
      state.loading = false;
      const deletedId = action.meta.arg;
      state.appointments = state.appointments.filter((a) => a._id !== deletedId);
      state.successMessage = "Termin wurde gelöscht.";
    });
    builder.addCase(deleteAppointment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearAppointmentMessages } = appointmentsSlice.actions;
export default appointmentsSlice.reducer;
