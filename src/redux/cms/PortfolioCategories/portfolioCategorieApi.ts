import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../../../api/baseQuery";
import type { PortfolioCategorie, PortfolioCategorieDropdown } from "./portfolioCategorieTypes";

export const portfolioCategorieApi = createApi({
  reducerPath: "portfolioCategorieApi",
  baseQuery,
  tagTypes: ["PortfolioCategories"],
  endpoints: (builder) => ({
    // ✅ GET JOBS WITH PAGINATION + SEARCH + SORT
    fetchPortfolioCategories: builder.query<
      {
        success: boolean;
        message: string;
        columns: string[];
        visible_columns: string[];
        data: {
          current_page: number;
          data: PortfolioCategorie[];   // actual records
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
        url: "/cms/portfolio-categories",
        method: "GET",
        params,
      }),
      providesTags: ["PortfolioCategories"],
    }),

    // ✅ GET SINGLE PortfolioCategorie
    fetchPortfolioCategorieById: builder.query<PortfolioCategorie, string>({
      query: (uuid) => `/cms/portfolio-categories/${uuid}`,
    }),

    // ✅ CREATE
    createPortfolioCategorie: builder.mutation<PortfolioCategorie, Partial<PortfolioCategorie>>({
      query: (portfolioCategorieData) => ({
        url: "/cms/portfolio-categories",
        method: "POST",
        body: portfolioCategorieData,
      }),
      invalidatesTags: ["PortfolioCategories"],
    }),

    // ✅ UPDATE
    updatePortfolioCategorie: builder.mutation<PortfolioCategorie, { uuid: string; portfolioCategorieData: Partial<PortfolioCategorie> }>({
      query: ({ uuid, portfolioCategorieData }) => ({
        url: `/cms/portfolio-categories/${uuid}`,
        method: "PUT",
        body: portfolioCategorieData,
      }),
      invalidatesTags: ["PortfolioCategories"],
    }),

    // ✅ DELETE
    deletePortfolioCategorie: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/cms/portfolio-categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PortfolioCategories"],
    }),

    // ✅ DROPDOWN PortfolioCategorieS
    fetchDropdownPortfolioCategories: builder.query<PortfolioCategorieDropdown[], void>({
      query: () => `/cms/dropdown-portfolio-categories`,
    }),

    // ✅ DROPDOWN FAQCATEGORIES
    LazyFetchDropdownFaqCategoriesQuery: builder.query<PortfolioCategorieDropdown[], string>({
      query: (search) => `/engagement/dropdown-faqcategories?search=${search}`,
    }),

    // ✅ IMPORT PortfolioCategorieS
    importPortfolioCategories: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/cms/portfolio-categories-import",
        method: "POST",
        body: formData,
      }),
    }),

    // ✅ EXPORT PortfolioCategorieS
    exportPortfolioCategories: builder.mutation<Blob, { uuids: string[] }>({
      query: ({ uuids }) => ({
        url: "/cms/portfolio-categories-export",
        method: "POST",
        body: { uuids },
        responseHandler: (response: { blob: () => any; }) => response.blob(),
      }),
    }),
  }),
});

export const {
  useFetchPortfolioCategoriesQuery,
  useFetchPortfolioCategorieByIdQuery,
  useCreatePortfolioCategorieMutation,
  useUpdatePortfolioCategorieMutation,
  useDeletePortfolioCategorieMutation,
  useFetchDropdownPortfolioCategoriesQuery,
  useImportPortfolioCategoriesMutation,
  useExportPortfolioCategoriesMutation,
  useLazyFetchDropdownPortfolioCategoriesQuery
} = portfolioCategorieApi;
