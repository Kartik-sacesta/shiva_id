import { 
  setLoggedIn, 
  setUser, 
  clearAuth, 
  setAuthComplete,
  setAuthError
} from "../../redux/features/Auth/AuthSlice";
import customAxiosBaseQuery from "../utils/axios";
import { createApi } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: customAxiosBaseQuery,
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    login: builder.mutation({
      query(loginData) {
        return {
          url: "api/users/login",
          method: "POST",
          body: loginData,
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          const accessToken = data.access_token;
          const user = data.user;
          
          if (accessToken) {
            localStorage.setItem("accessToken", accessToken);
          }
          
          // Use setAuthComplete to set both login status and user data
          if (accessToken && user) {
            dispatch(setAuthComplete({ loggedIn: true, user }));
          } else if (accessToken) {
            dispatch(setLoggedIn(true));
            // If no user data in login response, fetch it separately
            dispatch(authApi.endpoints.getCurrentUser.initiate());
          }
        } catch (error) {
          console.error("Login error:", error);
          dispatch(setAuthError(error.message || "Login failed"));
        }
      },
      transformResponse: (result) => {
        return result?.data;
      },
    }),

    getCurrentUser: builder.query({
      query() {
        return {
          url: "api/users",
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const user = data;
          
          if (user) {
            dispatch(setUser(user));
          }
        } catch (error) {
          console.error("Get current user error:", error);
          // If getting user fails, it might be due to invalid token
          if (error.error?.status === 401 || error.error?.status === 403) {
            dispatch(clearAuth());
          } else {
            dispatch(setAuthError("Failed to fetch user data"));
          }
        }
      },
      transformResponse: (result) => {
        return result?.data;
      },
    }),

    validateToken: builder.query({
      query() {
        return {
          url: "api/users/verify-session",
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          
          // Token is valid, now fetch user data
          if (data) {
            dispatch(setLoggedIn(true));
            // Immediately fetch current user data
            dispatch(authApi.endpoints.getCurrentUser.initiate());
          } else {
            dispatch(clearAuth());
          }
        } catch (error) {
          console.error("Token validation error:", error);
          // Token is invalid or expired
          dispatch(clearAuth());
        }
      },
      transformResponse: (result) => {
        return result?.data;
      },
    }),

    // Enhanced token validation that includes user data
    validateTokenWithUser: builder.query({
      query() {
        return {
          url: "api/users/verify-session-with-user",
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          
          if (data && data.valid && data.user) {
            // Token is valid and we have user data
            dispatch(setAuthComplete({ loggedIn: true, user: data.user }));
          } else if (data && data.valid) {
            // Token is valid but no user data, fetch separately
            dispatch(setLoggedIn(true));
            dispatch(authApi.endpoints.getCurrentUser.initiate());
          } else {
            dispatch(clearAuth());
          }
        } catch (error) {
          console.error("Token validation with user error:", error);
          dispatch(clearAuth());
        }
      },
      transformResponse: (result) => {
        return result?.data;
      },
    }),

    logout: builder.mutation({
      query() {
        return {
          url: "api/users/logout",
          method: "POST",
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          // Always clear auth state on logout
          dispatch(clearAuth());
        }
      },
    }),

    // checkAdmin: builder.query({
    //   query() {
    //     return {
    //       url: "api/user/validate-role",
    //     };
    //   },
    // }),
  }),
});

export const {
  useLoginMutation,
  useValidateTokenQuery,
  useValidateTokenWithUserQuery,
  useGetCurrentUserQuery,
  useLogoutMutation,
  useCheckAdminQuery,
} = authApi;
