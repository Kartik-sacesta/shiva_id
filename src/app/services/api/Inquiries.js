import customAxiosBaseQuery from "../utils/axios";
import { createApi } from "@reduxjs/toolkit/query/react";

export const InquiriesApi = createApi({
  reducerPath: "InquiriesApi",
  baseQuery: customAxiosBaseQuery,
  tagTypes: ["Inquiries"],
  endpoints: (builder) => ({
    getInquiries: builder.mutation({
      query(id) {
        return {
          url: `api/inquiry/${id}`,
          method: "GET",
        };
      },
      invalidatesTags: ["Inquiries"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.log(error);
        }
      },
      transformResponse: (result) => {
        return result;
      },
      transformErrorResponse: (result) => {
        return result?.data?.message || "";
      },
    }),
  }),
});

export const { useGetInquiriesMutation } = InquiriesApi;
