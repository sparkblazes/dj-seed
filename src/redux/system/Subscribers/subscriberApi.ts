import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../../../api/baseQuery";
import type { Subscriber, SubscriberDropdown } from "./subscriberTypes";

export const subscriberApi = createApi({
  reducerPath: "subscriberApi",
  baseQuery,
  tagTypes: ["Subscribers"],
  endpoints: (builder) => ({
    // ✅ GET SUBSCRIBER WITH PAGINATION + SEARCH + SORT
    fetchSubscribers: builder.query<
      {
        success: boolean;
        message: string;
        columns: string[];
        visible_columns: string[];
        data: {
          current_page: number;
          data: Permissions[];   // actual records
          last_page: number;
          per_page: number;
          total: number;
        };
      },
      {
        per_page?: number;
        page?: number;
        search?: string;
        sort_by?: string;
        sort_order?: string;
      }
    >({
      query: (params) => ({
        url: "/system/subscribers",
        method: "GET",
        params,
      }),
      providesTags: ["Subscribers"],
    }),

    // ✅ GET SINGLE SUBSCRIBER
    fetchSubscriberById: builder.query<Subscriber, string>({
      query: (uuid) => `/engagement/subscribers/${uuid}`,
    }),

    // ✅ CREATE
    createSubscriber: builder.mutation<Subscriber, Partial<Subscriber>>({
      query: (subscriberData) => ({
        url: "/system/subscribers",
        method: "POST",
        body: subscriberData,
      }),
      invalidatesTags: ["Subscribers"],
    }),

    // ✅ UPDATE
    updateSubscriber: builder.mutation<Subscriber, { uuid: string; subscriberData: Partial<Subscriber> }>({
      query: ({ uuid, subscriberData }) => ({
        url: `/system/subscribers/${uuid}`,
        method: "PUT",
        body: subscriberData,
      }),
      invalidatesTags: ["Subscribers"],
    }),

    // ✅ DELETE
    deleteSubscriber: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/system/subscribers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Subscribers"],
    }),

    // ✅ DROPDOWN SUBSCRIBERS
    fetchDropdownSubscribers: builder.query<SubscriberDropdown[], void>({
      query: () => `/system/dropdown-subscribers`,
    }),

    // ✅ IMPORT SUBSCRIBERS
    importSubscribers: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/system/subscribers-import",
        method: "POST",
        body: formData,
      }),
    }),

    // ✅ EXPORT SUBSCRIBERS
    exportSubscribers: builder.mutation<Blob, { uuids: string[] }>({
      query: ({ uuids }) => ({
        url: "/system/subscribers-export",
        method: "POST",
        body: { uuids },
        responseHandler: (response: { blob: () => any; }) => response.blob(),
      }),
    }),
  }),
});

export const {
  useFetchSubscribersQuery,
  useFetchSubscriberByIdQuery,
  useCreateSubscriberMutation,
  useUpdateSubscriberMutation,
  useDeleteSubscriberMutation,
  useFetchDropdownSubscribersQuery,
  useImportSubscribersMutation,
  useExportSubscribersMutation,
} = subscriberApi;
