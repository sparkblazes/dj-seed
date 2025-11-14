//src/redux/engagement/FaqCategories/faqCategoriesApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../../../api/baseQuery";
import type { FaqCategories, FaqCategoriesDropdown } from "./faqCategoriesTypes";

export const faqCategoriesApi = createApi({
  reducerPath: "faqCategoriesApi",
  baseQuery,
  tagTypes: ["FaqCategories"],
  endpoints: (builder) => ({
    // ✅ GET FAQCATEGORIES WITH PAGINATION + SEARCH + SORT
    fetchFaqCategories: builder.query<
      {
        success: boolean;
        message: string;
        columns: string[];
        visible_columns: string[];
        data: {
          current_page: number;
          data: FaqCategories[];   // actual records
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
        url: "/engagement/faqcategories",
        method: "GET",
        params,
      }),
      providesTags: ["FaqCategories"],
    }),

    // ✅ GET SINGLE FAQCATEGORIES
    fetchFaqCategoriesById: builder.query<FaqCategories, string>({
      query: (uuid) => `/engagement/faqcategories/${uuid}`,
    }),

    // ✅ CREATE
    createFaqCategories: builder.mutation<FaqCategories, Partial<FaqCategories>>({
      query: (faqCategoriesData) => ({
        url: "/engagement/faqcategories",
        method: "POST",
        body: faqCategoriesData,
      }),
      invalidatesTags: ["FaqCategories"],
    }),

    // ✅ UPDATE
    updateFaqCategories: builder.mutation<FaqCategories, { uuid: string; faqCategoriesData: Partial<FaqCategories> }>({
      query: ({ uuid, faqCategoriesData }) => ({
        url: `/engagement/faqcategories/${uuid}`,
        method: "PUT",
        body: faqCategoriesData,
      }),
      invalidatesTags: ["FaqCategories"],
    }),

    // ✅ DELETE
    deleteFaqCategories: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/engagement/faqcategories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["FaqCategories"],
    }),

    // ✅ DROPDOWN FAQCATEGORIES
    fetchDropdownFaqCategories: builder.query<FaqCategoriesDropdown[], string>({
      query: (search) => `/engagement/dropdown-faqcategories?search=${search}`,
    }),

    // ✅ DROPDOWN FAQCATEGORIES
    LazyFetchDropdownFaqCategoriesQuery: builder.query<FaqCategoriesDropdown[], string>({
      query: (search) => `/engagement/dropdown-faqcategories?search=${search}`,
    }),

    // ✅ IMPORT FAQCATEGORIES
    importFaqCategories: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/engagement/faqcategories-import",
        method: "POST",
        body: formData,
      }),
    }),

    // ✅ EXPORT FAQCATEGORIES
    exportFaqCategories: builder.mutation<Blob, { uuids: string[] }>({
      query: ({ uuids }) => ({
        url: "/engagement/faqcategories-export",
        method: "POST",
        body: { uuids },
        responseHandler: (response: { blob: () => any; }) => response.blob(),
      }),
    }),
  }),
});

export const {
  useFetchFaqCategoriesQuery,
  useFetchFaqCategoriesByIdQuery,
  useCreateFaqCategoriesMutation,
  useUpdateFaqCategoriesMutation,
  useDeleteFaqCategoriesMutation,
  useImportFaqCategoriesMutation,
  useExportFaqCategoriesMutation,
  useLazyFetchDropdownFaqCategoriesQuery
} = faqCategoriesApi;
