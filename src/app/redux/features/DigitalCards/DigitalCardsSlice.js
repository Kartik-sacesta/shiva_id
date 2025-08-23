import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // token: "",
  digitalCards: [],
  digitalCardUpdating: false,
  digitalCard: null,
};

const digitalCards = createSlice({
  name: "digitalCards",
  initialState,
  reducers: {
    // setToken: (state, action) => {
    //   state.token = action.payload;
    // },
    setDigitalCards: (state, action) => {
      state.digitalCards = action.payload;
    },

    setDigitalCardUpdating: (state, action) => {
      state.digitalCardUpdating = action.payload;
    },

    setDigitalCard: (state, action) => {
      state.digitalCard = action.payload;
    },
  },
});

export const { setDigitalCards, setDigitalCardUpdating, setDigitalCard } =
  digitalCards.actions;

// export const getToken = (state) => state.authState.token;
export const getDigitalCard = (state) => state.digitalCardsState.digitalCard;

export default digitalCards.reducer;
