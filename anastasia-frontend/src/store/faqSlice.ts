// src/store/faqSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apiCall from "@/lib/apiCall";

export interface FAQ {
  _id?: string;
  question: string;
  answer: string;
  category?: string;
}

interface FAQState {
  faqs: FAQ[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: FAQState = {
  faqs: [],
  loading: false,
  error: null,
  successMessage: null,
};

// 📄 Alle FAQs abrufen
export const fetchFAQs = createAsyncThunk(
  "faq/fetchFAQs",
  async (_, thunkAPI) =>
    await apiCall("get", "/faqs", null, thunkAPI.rejectWithValue)
);

// ➕ Neue FAQ hinzufügen
export const createFAQ = createAsyncThunk(
  "faq/createFAQ",
  async (data: { question: string; answer: string; category?: string }, thunkAPI) =>
    await apiCall("post", "/faqs", data, thunkAPI.rejectWithValue)
);

// 🗑️ FAQ löschen
export const deleteFAQ = createAsyncThunk(
  "faq/deleteFAQ",
  async (id: string, thunkAPI) =>
    await apiCall("delete", `/faqs/${id}`, null, thunkAPI.rejectWithValue)
);

const faqSlice = createSlice({
  name: "faq",
  initialState,
  reducers: {
    clearFAQMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    const loadingReducer = (state: FAQState) => {
      state.loading = true;
      state.error = null;
    };

    const errorReducer = (state: FAQState, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    };

    // Fetch
    builder
      .addCase(fetchFAQs.pending, loadingReducer)
      .addCase(fetchFAQs.fulfilled, (state, action) => {
        state.loading = false;
        state.faqs = action.payload;
      })
      .addCase(fetchFAQs.rejected, errorReducer);

    // Create
    builder
      .addCase(createFAQ.pending, loadingReducer)
      .addCase(createFAQ.fulfilled, (state, action) => {
        state.loading = false;
        state.faqs.unshift(action.payload.faq);
        state.successMessage = "FAQ wurde erfolgreich erstellt.";
      })
      .addCase(createFAQ.rejected, errorReducer);

    // Delete
    builder
      .addCase(deleteFAQ.pending, loadingReducer)
      .addCase(deleteFAQ.fulfilled, (state, action) => {
        state.loading = false;
        state.faqs = state.faqs.filter((f) => f._id !== action.payload?.faq?._id);
        state.successMessage = "FAQ wurde gelöscht.";
      })
      .addCase(deleteFAQ.rejected, errorReducer);
  },
});

export const { clearFAQMessages } = faqSlice.actions;
export default faqSlice.reducer;
