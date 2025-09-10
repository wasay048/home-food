import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  goGrabItems: [],
  preOrderItems: [],
  availablePreorderDates: [],
  kitchen: null,
  isLoading: false,
  lastUpdated: null,
  kitchenId: null,
};

const listingSlice = createSlice({
  name: "listing",
  initialState,
  reducers: {
    setListingLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setListingData: (state, action) => {
      const { goGrabItems, preOrderItems, availablePreorderDates, kitchen } =
        action.payload;
      state.goGrabItems = goGrabItems;
      state.preOrderItems = preOrderItems;
      state.availablePreorderDates = availablePreorderDates;
      state.kitchen = kitchen;
      state.kitchenId = kitchen?.id || null;
      state.isLoading = false;
      state.lastUpdated = Date.now();
    },
    clearListingData: (state) => {
      return initialState;
    },
  },
});

export const { setListingLoading, setListingData, clearListingData } =
  listingSlice.actions;
export default listingSlice.reducer;
