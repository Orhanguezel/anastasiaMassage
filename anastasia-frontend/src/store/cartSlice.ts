import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apiCall from "@/lib/apiCall";
import type { IProduct } from "@/types/product";

interface CartItem {
  product: IProduct;
  quantity: number;
  priceAtAddition: number;
}

interface Cart {
  _id?: string;
  user?: string;
  items: CartItem[];
  totalPrice: number;
}

interface CartState {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: CartState = {
  cart: null,
  loading: false,
  error: null,
  successMessage: null,
};

// Async Thunks
export const fetchCart = createAsyncThunk("cart/fetchCart", async (_, thunkAPI) =>
  await apiCall("get", "/cart", null, thunkAPI.rejectWithValue)
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (payload: { productId: string; quantity: number }, thunkAPI) =>
    await apiCall("post", "/cart/add", payload, thunkAPI.rejectWithValue)
);

export const increaseQuantity = createAsyncThunk(
  "cart/increaseQuantity",
  async (productId: string, thunkAPI) =>
    await apiCall("put", `/cart/increase/${productId}`, null, thunkAPI.rejectWithValue)
);

export const decreaseQuantity = createAsyncThunk(
  "cart/decreaseQuantity",
  async (productId: string, thunkAPI) =>
    await apiCall("put", `/cart/decrease/${productId}`, null, thunkAPI.rejectWithValue)
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (productId: string, thunkAPI) =>
    await apiCall("delete", `/cart/remove/${productId}`, null, thunkAPI.rejectWithValue)
);

export const clearCart = createAsyncThunk("cart/clearCart", async (_, thunkAPI) =>
  await apiCall("delete", "/cart/clear", null, thunkAPI.rejectWithValue)
);

// Slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCartMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    const loadingReducer = (state: CartState) => {
      state.loading = true;
      state.error = null;
    };

    const errorReducer = (state: CartState, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    };

    builder
      .addCase(fetchCart.pending, loadingReducer)
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, errorReducer);

    builder
      .addCase(addToCart.pending, loadingReducer)
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload.cart;
        state.successMessage = "Produkt wurde zum Warenkorb hinzugefügt.";
      })
      .addCase(addToCart.rejected, errorReducer);

    builder
      .addCase(increaseQuantity.pending, loadingReducer)
      .addCase(increaseQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload.cart;
      })
      .addCase(increaseQuantity.rejected, errorReducer);

    builder
      .addCase(decreaseQuantity.pending, loadingReducer)
      .addCase(decreaseQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload.cart;
      })
      .addCase(decreaseQuantity.rejected, errorReducer);

    builder
      .addCase(removeFromCart.pending, loadingReducer)
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload.cart;
        state.successMessage = "Produkt wurde aus dem Warenkorb entfernt.";
      })
      .addCase(removeFromCart.rejected, errorReducer);

    builder
      .addCase(clearCart.pending, loadingReducer)
      .addCase(clearCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload.cart;
        state.successMessage = "Warenkorb wurde geleert.";
      })
      .addCase(clearCart.rejected, errorReducer);
  },
});

export const { clearCartMessages } = cartSlice.actions;
export default cartSlice.reducer;
