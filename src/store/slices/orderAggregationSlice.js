import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAggregatedOrderQuantities } from "../../services/orderService";

export const fetchAggregatedOrderQuantities = createAsyncThunk(
  "orderAggregation/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const quantities = await getAggregatedOrderQuantities();
      return quantities;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  quantitiesByItemName: {},
  isLoading: false,
  error: null,
  lastFetched: null,
};

const orderAggregationSlice = createSlice({
  name: "orderAggregation",
  initialState,
  reducers: {
    clearAggregatedOrders: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAggregatedOrderQuantities.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAggregatedOrderQuantities.fulfilled, (state, action) => {
        state.isLoading = false;
        state.quantitiesByItemName = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchAggregatedOrderQuantities.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAggregatedOrders } = orderAggregationSlice.actions;
export default orderAggregationSlice.reducer;
