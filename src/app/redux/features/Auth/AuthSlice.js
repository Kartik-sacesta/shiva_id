import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loggedIn: false,
  user: null,
  loading: true,
  authChecked: false, // Track if initial auth check is complete
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthLoading: (state, action) => {
      state.loading = action.payload;
    },
    setLoggedIn: (state, action) => {
      state.loggedIn = action.payload;
      if (!action.payload) {
        // If logging out, clear user data
        state.user = null;
      }
    },
    setUser: (state, action) => {
      state.user = action.payload;
      if (action.payload) {
        state.loggedIn = true;
      }
    },
    setAuthChecked: (state, action) => {
      state.authChecked = action.payload;
      state.loading = false;
    },
    setAuthError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
   // In AuthSlice.js - Replace the clearAuth reducer with this:
clearAuth: (state) => {
  state.loggedIn = false;
  state.user = null;
  state.loading = false;
  state.authChecked = true;
  state.error = null;
  
  // Only clear token if we're actually clearing auth
  if (typeof window !== 'undefined' && localStorage.getItem("accessToken")) {
    localStorage.removeItem("accessToken");
  }
},
    // Complete authentication setup (both login status and user data)
    setAuthComplete: (state, action) => {
      const { loggedIn, user } = action.payload;
      state.loggedIn = loggedIn;
      state.user = user;
      state.loading = false;
      state.authChecked = true;
      state.error = null;
    },
  },
});

export const { 
  setAuthLoading,
  setLoggedIn, 
  setUser, 
  setAuthChecked,
  setAuthError,
  clearAuth,
  setAuthComplete
} = authSlice.actions;

// Enhanced Selectors
export const getLoggedIn = (state) => state.authState.loggedIn;
export const getUser = (state) => state.authState?.user;
export const isUserLoading = (state) => state.authState?.loading;
export const isAuthChecked = (state) => state.authState?.authChecked;
export const getAuthError = (state) => state.authState?.error;

// Role-based selectors with better error handling
export const getUserRole = (state) => {
  const user = state.authState?.user;
  return user?.role || null;
};

export const isAdmin = (state) => {
  const user = state.authState?.user;
  const isLoggedIn = state.authState?.loggedIn;
  return isLoggedIn && user?.role === 'admin';
};

export const isUser = (state) => {
  const user = state.authState?.user;
  const isLoggedIn = state.authState?.loggedIn;
  return isLoggedIn && user?.role === 'user';
};

// Helper selector to check if user data is available
export const hasUserData = (state) => {
  return state.authState?.user !== null;
};

// Selector to check if authentication is ready (not loading and checked)
export const isAuthReady = (state) => {
  return !state.authState?.loading && state.authState?.authChecked;
};

export default authSlice.reducer;
