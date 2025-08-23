import { setDigitalCard } from "../../redux/features/DigitalCards/DigitalCardsSlice";
import customAxiosBaseQuery from "../utils/axios";
import { createApi } from "@reduxjs/toolkit/query/react";

export const CustomerApi = createApi({
  reducerPath: "CustomerApi",
  baseQuery: customAxiosBaseQuery,
  tagTypes: ["Customer"],
  endpoints: (builder) => ({
    generateDigitalCard: builder.mutation({
      query(payload) {
        return {
          url: "api/customer/generateDigitalCard",
          method: "POST",
          body: { ...payload },
        };
      },
      invalidatesTags: ["Customer"],
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
    updateCard: builder.mutation({
      query(payload) {
        return {
          // url: "api/customer/generateDigitalCard",
          url: `api/customer/update-card-details/${payload.id}`,
          method: "PUT",
          body: { ...payload },
        };
      },
      invalidatesTags: ["Customer"],
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
    createCard: builder.mutation({
      query(payload) {
        return {
          url: `api/customer/create-card`,
          method: "POST",
          body: payload,
        };
      },
      invalidatesTags: ["Customer"],
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
    deleteDigitalCard: builder.mutation({
      query(payload) {
        return {
          url: "api/customer/deleteDigitalCard",
          method: "DELETE",
          body: { cardId: payload },
        };
      },
      invalidatesTags: ["Customer"],
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
        return result?.error;
      },
    }),
    getDigitalCards: builder.query({
      query() {
        return {
          url: "api/customer/getAll",
        };
      },
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error(error);
        }
      },
      providesTags: ["Customer"],
      transformResponse: (result) => {
        return result?.data;
      },
    }),
    getDigitalCard: builder.query({
      query(slug) {
        return {
          url: `api/customer/getCustomer/${slug}`,
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setDigitalCard(data));
        } catch (error) {
          console.error(error);
        }
      },
      providesTags: ["Customer"],
      // Assuming result is the object you provided
      transformResponse: (result) => {
        // Check and update clients array
        if (
          Array.isArray(result.data.clients) &&
          result.data.clients.length === 0
        ) {
          result.data.clients.push({ clientName: "", clientImg: "" });
        }

        // Check and update socialMedia array
        if (
          Array.isArray(result.data.socialMedia) &&
          result.data.socialMedia.length === 0
        ) {
          result.data.socialMedia.push({ name: "", link: "" });
        }

        // Check and update testimonials array
        if (
          Array.isArray(result.data.testimonials) &&
          result.data.testimonials.length === 0
        ) {
          result.data.testimonials.push({
            userName: "",
            userDesignation: "",
            userRating: "",
            userReview: "",
          });
        }

        // Check and update imageGallery array
        if (
          Array.isArray(result.data.imageGallery) &&
          result.data.imageGallery.length === 0
        ) {
          result.data.imageGallery.push({ image: "" });
        }

        const { _id, __v, ...formFields } = result.data;
        return { id: _id, ...formFields };
      },
    }),
  }),
});

export const {
  useGenerateDigitalCardMutation,
  useGetDigitalCardsQuery,
  useGetDigitalCardQuery,
  useDeleteDigitalCardMutation,
  useUpdateCardMutation,
  useCreateCardMutation,
} = CustomerApi;
