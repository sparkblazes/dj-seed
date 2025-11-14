import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../../../api/baseQuery";
import type { Order, PaginationMeta, OrderDropdown } from "./orderTypes";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery,
  tagTypes: ["Orders"],
  endpoints: (builder) => ({
    // ✅ GET JOBS WITH PAGINATION + SEARCH + SORT
    fetchOrders: builder.query<
      { data: Order[]; meta: PaginationMeta },
      { per_page?: number; page?: number; search?: string; sort_by?: string; sort_order?: string }
    >({
      query: (params) => ({
        url: "/ecommerce/orders",
        method: "GET",
        params,
      }),
      providesTags: ["Orders"],
    }),

    // ✅ GET SINGLE JOB
    fetchOrderById: builder.query<Order, number>({
      query: (id) => `/ecommerce/orders/${id}`,
    }),

    // ✅ CREATE
    createOrder: builder.mutation<Order, Partial<Order>>({
      query: (orderData) => ({
        url: "/ecommerce/orders",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["Orders"],
    }),

    // ✅ UPDATE
    updateOrder: builder.mutation<Order, { id: number; orderData: Partial<Order> }>({
      query: ({ id, orderData }) => ({
        url: `/ecommerce/orders/${id}`,
        method: "PUT",
        body: orderData,
      }),
      invalidatesTags: ["Orders"],
    }),

    // ✅ DELETE
    deleteOrder: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/ecommerce/orders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Orders"],
    }),

    // ✅ DROPDOWN JOBS
    fetchDropdownOrders: builder.query<OrderDropdown[], void>({
      query: () => `/ecommerce/dropdown-orders`,
    }),

    // ✅ IMPORT JOBS
    importOrders: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/ecommerce/orders-import",
        method: "POST",
        body: formData,
      }),
    }),

    // ✅ EXPORT JOBS
    exportOrders: builder.mutation<Blob, { uuids: string[] }>({
      query: ({ uuids }) => ({
        url: "/ecommerce/orders-export",
        method: "POST",
        body: { uuids },
        responseHandler: (response: { blob: () => any; }) => response.blob(),
      }),
    }),
  }),
});

export const {
  useFetchOrdersQuery,
  useFetchOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useFetchDropdownOrdersQuery,
  useImportOrdersMutation,
  useExportOrdersMutation,
} = orderApi;
