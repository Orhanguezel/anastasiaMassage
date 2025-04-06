// src/store/couponSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apiCall from "@/lib/apiCall";

export interface Coupon {
  _id?: string;
  code: string;
  discount: number;
  expiresAt: string;
  isActive: boolean;
}

interface CouponState {
  coupons: Coupon[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: CouponState = {
  coupons: [],
  loading: false,
  error: null,
  successMessage: null,
};

// ✅ Get all coupons
export const fetchCoupons = createAsyncThunk(
  "coupon/fetchCoupons",
  async (_, thunkAPI) =>
    await apiCall("get", "/coupons", null, thunkAPI.rejectWithValue)
);

// ➕ Create new coupon
export const createCoupon = createAsyncThunk(
  "coupon/createCoupon",
  async (data: { code: string; discount: number; expiresAt: string }, thunkAPI) =>
    await apiCall("post", "/coupons", data, thunkAPI.rejectWithValue)
);

// 📝 Update coupon
export const updateCoupon = createAsyncThunk(
  "coupon/updateCoupon",
  async ({ id, data }: { id: string; data: Partial<Coupon> }, thunkAPI) =>
    await apiCall("put", `/coupons/${id}`, data, thunkAPI.rejectWithValue)
);

// 🗑️ Delete coupon
export const deleteCoupon = createAsyncThunk(
  "coupon/deleteCoupon",
  async (id: string, thunkAPI) =>
    await apiCall("delete", `/coupons/${id}`, null, thunkAPI.rejectWithValue)
);

const couponSlice = createSlice({
  name: "coupon",
  initialState,
  reducers: {
    clearCouponMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    const loadingReducer = (state: CouponState) => {
      state.loading = true;
      state.error = null;
    };

    const errorReducer = (state: CouponState, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    };

    builder
      .addCase(fetchCoupons.pending, loadingReducer)
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = action.payload;
      })
      .addCase(fetchCoupons.rejected, errorReducer);

    builder
      .addCase(createCoupon.pending, loadingReducer)
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Gutschein wurde erfolgreich erstellt.";
        state.coupons.unshift(action.payload.coupon);
      })
      .addCase(createCoupon.rejected, errorReducer);

    builder
      .addCase(updateCoupon.pending, loadingReducer)
      .addCase(updateCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Gutschein wurde aktualisiert.";
        const updated = action.payload.coupon;
        const index = state.coupons.findIndex((c) => c._id === updated._id);
        if (index !== -1) state.coupons[index] = updated;
      })
      .addCase(updateCoupon.rejected, errorReducer);

    builder
      .addCase(deleteCoupon.pending, loadingReducer)
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Gutschein wurde gelöscht.";
        const id = action.payload?.coupon?._id;
        if (id) state.coupons = state.coupons.filter((c) => c._id !== id);
      })
      .addCase(deleteCoupon.rejected, errorReducer);
  },
});

export const { clearCouponMessages } = couponSlice.actions;
export default couponSlice.reducer;
