import { configureStore } from "@reduxjs/toolkit";

// API
import { CustomerApi } from "../services/api/CustomerApi";
import { authApi } from "../services/api/AuthApi";
import { InquiriesApi } from "../services/api/Inquiries";

// Reducers
import loadingReducer from "../redux/features/Loading/LoadingSlice";
import authReducer from "../redux/features/Auth/AuthSlice";
import digitalCardReducer from "../redux/features/DigitalCards/DigitalCardsSlice";

export const store = configureStore({
  reducer: {
    [CustomerApi.reducerPath]: CustomerApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [InquiriesApi.reducerPath]: InquiriesApi.reducer,
    loadingState: loadingReducer,
    authState: authReducer,
    digitalCardsState: digitalCardReducer,
  },
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({}).concat([
      CustomerApi.middleware,
      authApi.middleware,
      InquiriesApi.middleware,
    ]),
});
