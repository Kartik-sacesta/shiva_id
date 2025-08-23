import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // token: "",
  loggedIn: false,
  user: null,
  loading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoggedIn: (state, action) => {
      state.loggedIn = action.payload;
      state.loading = false;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.loading = false;
    },
  },
});

export const { setLoggedIn, setUser } = authSlice.actions;

// export const getToken = (state) => state.authState.token;
export const getLoggedIn = (state) => state.authState.loggedIn;
export const getUser = (state) => state.authState?.user;
export const isUserLoading = (state) => state.authState?.loading;
export default authSlice.reducer;
