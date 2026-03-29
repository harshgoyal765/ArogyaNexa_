import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartService } from '@/lib/services/cart.service';
import type { CartResponse } from '@/types/cart';

interface CartState {
  cart: CartResponse | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cart: null,
  isLoading: false,
  error: null,
};

export const fetchCartThunk = createAsyncThunk('cart/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await cartService.get();
    return data.data;
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } };
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
  }
});

export const addToCartThunk = createAsyncThunk(
  'cart/addItem',
  async ({ productId, quantity }: { productId: number; quantity: number }, { rejectWithValue }) => {
    try {
      const { data } = await cartService.addItem({ productId, quantity });
      return data.data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || 'Failed to add item');
    }
  }
);

export const removeFromCartThunk = createAsyncThunk(
  'cart/removeItem',
  async (itemUuid: string, { rejectWithValue }) => {
    try {
      const { data } = await cartService.removeItem(itemUuid);
      return data.data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || 'Failed to remove item');
    }
  }
);

export const updateCartItemThunk = createAsyncThunk(
  'cart/updateItem',
  async ({ itemUuid, quantity }: { itemUuid: string; quantity: number }, { rejectWithValue }) => {
    try {
      const { data } = await cartService.updateItem(itemUuid, quantity);
      return data.data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || 'Failed to update item');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCartState(state) {
      state.cart = null;
    },
  },
  extraReducers: (builder) => {
    const setLoading = (state: CartState) => { state.isLoading = true; state.error = null; };
    const setCart = (state: CartState, action: { payload: CartResponse }) => {
      state.isLoading = false;
      state.cart = action.payload;
    };
    const setError = (state: CartState, action: { payload: unknown }) => {
      state.isLoading = false;
      state.error = action.payload as string;
    };

    builder
      .addCase(fetchCartThunk.pending, setLoading)
      .addCase(fetchCartThunk.fulfilled, setCart)
      .addCase(fetchCartThunk.rejected, setError)
      .addCase(addToCartThunk.pending, setLoading)
      .addCase(addToCartThunk.fulfilled, setCart)
      .addCase(addToCartThunk.rejected, setError)
      .addCase(removeFromCartThunk.pending, setLoading)
      .addCase(removeFromCartThunk.fulfilled, setCart)
      .addCase(removeFromCartThunk.rejected, setError)
      .addCase(updateCartItemThunk.pending, setLoading)
      .addCase(updateCartItemThunk.fulfilled, setCart)
      .addCase(updateCartItemThunk.rejected, setError);
  },
});

export const { clearCartState } = cartSlice.actions;
export default cartSlice.reducer;
