import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../../../api/baseQuery";
import type { ApiToken, ApiTokenApiDropdown } from "./apiTokenTypes";

export const apiTokenApi = createApi({
  reducerPath: "apiTokenApi",
  baseQuery,
  tagTypes: ["ApiTokens"],
  endpoints: (builder) => ({
    // ✅ GET APITOKEN WITH PAGINATION + SEARCH + SORT
    fetchApiTokens: builder.query<
      {
        success: boolean;
        message: string;
        columns: string[];
        visible_columns: string[];
        data: {
          current_page: number;
          data: ApiToken[];   // actual records
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
        url: "/system/api-tokens",
        method: "GET",
        params,
      }),
      providesTags: ["ApiTokens"],
    }),

    // ✅ GET SINGLE APITOKEN
    fetchApiTokenById: builder.query<ApiToken, string>({
      query: (uuid) => `/system/api-tokens/${uuid}`,
    }),

    // ✅ CREATE
    createApiToken: builder.mutation<ApiToken, Partial<ApiToken>>({
      query: (apiTokenData) => ({
        url: "/system/api-tokens",
        method: "POST",
        body: apiTokenData,
      }),
      invalidatesTags: ["ApiTokens"],
    }),

    // ✅ UPDATE
    updateApiToken: builder.mutation<ApiToken, { uuid: string; apiTokenData: Partial<ApiToken> }>({
      query: ({ uuid, apiTokenData }) => ({
        url: `/system/api-tokens/${uuid}`,
        method: "PUT",
        body: apiTokenData,
      }),
      invalidatesTags: ["ApiTokens"],
    }),

    // ✅ DELETE
    deleteApiToken: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/system/api-tokens/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ApiTokens"],
    }),

    // ✅ DROPDOWN APITOKENS
    fetchDropdownApiTokens: builder.query<ApiTokenApiDropdown[], void>({
      query: () => `/system/dropdown-api-tokens`,
    }),

    // ✅ IMPORT APITOKENS
    importApiTokens: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/system/api-tokens-import",
        method: "POST",
        body: formData,
      }),
    }),

    // ✅ EXPORT APITOKENS
    exportApiTokens: builder.mutation<Blob, { uuids: string[] }>({
      query: ({ uuids }) => ({
        url: "/system/api-tokens-export",
        method: "POST",
        body: { uuids },
        responseHandler: (response: { blob: () => any; }) => response.blob(),
      }),
    }),
  }),
});

export const {
  useFetchApiTokensQuery,
  useFetchApiTokenByIdQuery,
  useCreateApiTokenMutation,
  useUpdateApiTokenMutation,
  useDeleteApiTokenMutation,
  useFetchDropdownApiTokensQuery,
  useImportApiTokensMutation,
  useExportApiTokensMutation,
} = apiTokenApi;
