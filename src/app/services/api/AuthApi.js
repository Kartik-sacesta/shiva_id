import { setLoggedIn, setUser } from "../../redux/features/Auth/AuthSlice";
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
      const user = data.user; // 👈 Extract user from response data
      
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        dispatch(setLoggedIn(true));
      }
      
      if (user) {
        dispatch(setUser(user)); // 👈 Store user with role immediately
      }
    } catch (error) {
      console.log(error);
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
          if (user) dispatch(setUser(user));
        } catch (error) {
          console.error("Query error", error);
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
  useGetCurrentUserQuery,
  useCheckAdminQuery,
} = authApi;
