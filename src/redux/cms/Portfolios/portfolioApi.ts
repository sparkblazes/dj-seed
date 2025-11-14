import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../../../api/baseQuery";
import type { Portfolio, PortfolioDropdown } from "./portfolioTypes";

export const portfolioApi = createApi({
  reducerPath: "portfolioApi",
  baseQuery,
  tagTypes: ["Portfolios"],
  endpoints: (builder) => ({
    // ✅ GET JOBS WITH PAGINATION + SEARCH + SORT
    fetchPortfolios: builder.query<
      {
             success: boolean;
             message: string;
             columns: string[];
             visible_columns: string[];
             data: {
               current_page: number;
               data: Portfolio[];   // actual records
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
        url: "/cms/portfolios",
        method: "GET",
        params,
      }),
      providesTags: ["Portfolios"],
    }),

    // ✅ GET SINGLE PORTFOLIO
    fetchPortfolioById: builder.query<Portfolio, string>({
      query: (uuid) => `/cms/portfolios/${uuid}`,
    }),

    // ✅ CREATE
    createPortfolio: builder.mutation<Portfolio, Partial<Portfolio>>({
      query: (portfolioData) => ({
        url: "/cms/portfolios",
        method: "POST",
        body: portfolioData,
      }),
      invalidatesTags: ["Portfolios"],
    }),

    // ✅ UPDATE
    updatePortfolio: builder.mutation<Portfolio, { uuid: string; portfolioData: Partial<Portfolio> }>({
      query: ({ uuid, portfolioData }) => ({
        url: `/cms/portfolios/${uuid}`,
        method: "PUT",
        body: portfolioData,
      }),
      invalidatesTags: ["Portfolios"],
    }),

    // ✅ DELETE
    deletePortfolio: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/cms/portfolios/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Portfolios"],
    }),

    // ✅ DROPDOWN PORTFOLIOS
    fetchDropdownPortfolios: builder.query<PortfolioDropdown[], void>({
      query: () => `/cms/dropdown-portfolios`,
    }),

    // ✅ IMPORT PORTFOLIOS
    importPortfolios: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/cms/portfolios-import",
        method: "POST",
        body: formData,
      }),
    }),

    // ✅ EXPORT PORTFOLIOS
    exportPortfolios: builder.mutation<Blob, { uuids: string[] }>({
      query: ({ uuids }) => ({
        url: "/cms/portfolios-export",
        method: "POST",
        body: { uuids },
        responseHandler: (response: { blob: () => any; }) => response.blob(),
      }),
    }),
  }),
});

export const {
  useFetchPortfoliosQuery,
  useFetchPortfolioByIdQuery,
  useCreatePortfolioMutation,
  useUpdatePortfolioMutation,
  useDeletePortfolioMutation,
  useFetchDropdownPortfoliosQuery,
  useImportPortfoliosMutation,
  useExportPortfoliosMutation,
} = portfolioApi;
