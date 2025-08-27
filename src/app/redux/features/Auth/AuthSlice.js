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
    clearAuth: (state) => {
      state.loggedIn = false;
      state.user = null;
      state.loading = false;
    },
  },
});

export const { setLoggedIn, setUser, clearAuth } = authSlice.actions;

// Selectors
export const getLoggedIn = (state) => state.authState.loggedIn;
export const getUser = (state) => state.authState?.user;
export const isUserLoading = (state) => state.authState?.loading;
export const getUserRole = (state) => state.authState?.user?.role || 'user';
export const isAdmin = (state) => state.authState?.user?.role === 'admin';
export const isUser = (state) => state.authState?.user?.role === 'user';

export default authSlice.reducer;
