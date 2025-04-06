// src/store/stockSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apiCall from "@/lib/apiCall";

export interface Stock {
  _id?: string;
  product: string | any;
  quantity: number;
  type: string;
  note?: string;
  createdAt?: string;
}

interface StockState {
  stocks: Stock[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: StockState = {
  stocks: [],
  loading: false,
  error: null,
  successMessage: null,
};

// ✅ Get all stock records
export const fetchStocks = createAsyncThunk(
  "stock/fetchStocks",
  async (_, thunkAPI) =>
    await apiCall("get", "/stocks", null, thunkAPI.rejectWithValue)
);

// ➕ Create new stock record
export const createStock = createAsyncThunk(
  "stock/createStock",
  async (
    data: { product: string; quantity: number; type: string; note?: string },
    thunkAPI
  ) => await apiCall("post", "/stocks", data, thunkAPI.rejectWithValue)
);

// 🗑️ Delete stock
export const deleteStock = createAsyncThunk(
  "stock/deleteStock",
  async (id: string, thunkAPI) =>
    await apiCall("delete", `/stocks/${id}`, null, thunkAPI.rejectWithValue)
);

const stockSlice = createSlice({
  name: "stock",
  initialState,
  reducers: {
    clearStockMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    const loadingReducer = (state: StockState) => {
      state.loading = true;
      state.error = null;
    };

    const errorReducer = (state: StockState, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    };

    // Fetch
    builder
      .addCase(fetchStocks.pending, loadingReducer)
      .addCase(fetchStocks.fulfilled, (state, action) => {
        state.loading = false;
        state.stocks = action.payload;
      })
      .addCase(fetchStocks.rejected, errorReducer);

    // Create
    builder
      .addCase(createStock.pending, loadingReducer)
      .addCase(createStock.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Lager wurde erfolgreich erstellt.";
        state.stocks.unshift(action.payload.stock); // add to beginning
      })
      .addCase(createStock.rejected, errorReducer);

    // Delete
    builder
      .addCase(deleteStock.pending, loadingReducer)
      .addCase(deleteStock.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Lager wurde gelöscht.";
        state.stocks = state.stocks.filter(
          (s) => s._id !== action.payload?.stock?._id
        );
      })
      .addCase(deleteStock.rejected, errorReducer);
  },
});

export const { clearStockMessages } = stockSlice.actions;
export default stockSlice.reducer;
