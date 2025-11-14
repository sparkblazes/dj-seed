import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../../../api/baseQuery";
import type { Faqs, FaqDropdown } from "./faqTypes";

export const faqApi = createApi({
  reducerPath: "faqApi",
  baseQuery,
  tagTypes: ["Faqs"],
  endpoints: (builder) => ({
    // ✅ GET FAQ WITH PAGINATION + SEARCH + SORT
    fetchFaqs: builder.query<
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
        url: "/engagement/faqs",
        method: "GET",
        params,
      }),
      providesTags: ["Faqs"],
    }),

    // ✅ GET SINGLE FAQ
    fetchFaqById: builder.query<Faqs, string>({
      query: (uuid) => `/engagement/faqs/${uuid}`,
    }),

    // ✅ CREATE
    createFaq: builder.mutation<Faqs, Partial<Faqs>>({
      query: (faqsData) => ({
        url: "/engagement/faqs",
        method: "POST",
        body: faqsData,
      }),
      invalidatesTags: ["Faqs"],
    }),

    // ✅ UPDATE
    updateFaq: builder.mutation<Faqs, { uuid: string; faqsData: Partial<Faqs> }>({
      query: ({ uuid, faqsData }) => ({
        url: `/engagement/faqs/${uuid}`,
        method: "PUT",
        body: faqsData,
      }),
      invalidatesTags: ["Faqs"],
    }),

    // ✅ DELETE
    deleteFaq: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/engagement/faqs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Faqs"],
    }),

    // ✅ DROPDOWN FAQS
    fetchDropdownFaqs: builder.query<FaqDropdown[], void>({
      query: () => `/engagement/dropdown-faqs`,
    }),

    // ✅ IMPORT FAQS
    importFaqs: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/engagement/faqs-import",
        method: "POST",
        body: formData,
      }),
    }),

    // ✅ EXPORT FAQS
    exportFaqs: builder.mutation<Blob, { uuids: string[] }>({
      query: ({ uuids }) => ({
        url: "/engagement/faqs-export",
        method: "POST",
        body: { uuids },
        responseHandler: (response: { blob: () => any; }) => response.blob(),
      }),
    }),
  }),
});

export const {
  useFetchFaqsQuery,
  useFetchFaqByIdQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
  useFetchDropdownFaqsQuery,
  useImportFaqsMutation,
  useExportFaqsMutation,
} = faqApi;
