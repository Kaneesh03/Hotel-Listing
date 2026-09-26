import { createSlice } from "@reduxjs/toolkit";



const initialState = {
  hotels: [],
};

export const hotelSlice = createSlice({
  name: "hotels",
  initialState,
  reducers: {
    setHotels: function(state, action) {
      state.hotels = action.payload;
    },

    deleteHotel: function(state, action) {
      const hotelIdToDelete = action.payload;
      state.hotels = state.hotels.filter(function(hotel) {
        return hotel.id !== hotelIdToDelete;
      });
    },
  },
});

export const { setHotels, deleteHotel } = hotelSlice.actions;
export default hotelSlice.reducer;
