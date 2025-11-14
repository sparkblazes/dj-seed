import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../../../api/baseQuery";
import type { Payment, PaginationMeta, PaymentDropdown } from "./paymentTypes";

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery,
  tagTypes: ["Payments"],
  endpoints: (builder) => ({
    // ✅ GET JOBS WITH PAGINATION + SEARCH + SORT
    fetchPayments: builder.query<
      { data: Payment[]; meta: PaginationMeta },
      { per_page?: number; page?: number; search?: string; sort_by?: string; sort_order?: string }
    >({
      query: (params) => ({
        url: "/ecommerce/payments",
        method: "GET",
        params,
      }),
      providesTags: ["Payments"],
    }),

    // ✅ GET SINGLE JOB
    fetchPaymentById: builder.query<Payment, number>({
      query: (id) => `/ecommerce/payments/${id}`,
    }),

    // ✅ CREATE
    createPayment: builder.mutation<Payment, Partial<Payment>>({
      query: (paymentData) => ({
        url: "/ecommerce/payments",
        method: "POST",
        body: paymentData,
      }),
      invalidatesTags: ["Payments"],
    }),

    // ✅ UPDATE
    updatePayment: builder.mutation<Payment, { id: number; paymentData: Partial<Payment> }>({
      query: ({ id, paymentData }) => ({
        url: `/ecommerce/payments/${id}`,
        method: "PUT",
        body: paymentData,
      }),
      invalidatesTags: ["Payments"],
    }),

    // ✅ DELETE
    deletePayment: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/ecommerce/payments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Payments"],
    }),

    // ✅ DROPDOWN PAYMENTS
    fetchDropdownPayments: builder.query<PaymentDropdown[], void>({
      query: () => `/ecommerce/dropdown-payments`,
    }),

    // ✅ IMPORT PAYMENTS
    importPayments: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/ecommerce/payments-import",
        method: "POST",
        body: formData,
      }),
    }),

    // ✅ EXPORT PAYMENTS
    exportPayments: builder.mutation<Blob, { uuids: string[] }>({
      query: ({ uuids }) => ({
        url: "/ecommerce/payments-export",
        method: "POST",
        body: { uuids },
        responseHandler: (response: { blob: () => any; }) => response.blob(),
      }),
    }),
  }),
});

export const {
  useFetchPaymentsQuery,
  useFetchPaymentByIdQuery,
  useCreatePaymentMutation,
  useUpdatePaymentMutation,
  useDeletePaymentMutation,
  useFetchDropdownPaymentsQuery,
  useImportPaymentsMutation,
  useExportPaymentsMutation,
} = paymentApi;
